# finlit-backend/recommendation_logic.py
import random
from typing import List, Optional, Dict, Set
from models import UserProfile, ContentItem, Recommendation
from data_store import get_all_content, get_all_topic_ids, get_topic_name_from_id

def _create_reason(reason_code: str, topic_id: int) -> str:
    topic_name = get_topic_name_from_id(topic_id); reasons = { "misconception": f"Addresses confusion in '{topic_name}' (Incorrect/High Conf).", "knowledge_gap": f"Fills knowledge gap in '{topic_name}' (Incorrect/Low Conf).", "reinforcement": f"Reinforces '{topic_name}' (Correct/Low Conf).", "new_topic": f"Introduces '{topic_name}'.", "proficient_explore": f"Explore more about '{topic_name}'." }; return reasons.get(reason_code, f"Related to {topic_name}")

def generate_recommendations_for_user(profile: UserProfile, limit: int = 5) -> List[Recommendation]:
    all_content = get_all_content();
    if not all_content: return []
    candidate_content = list(all_content); recommendations_map: Dict[str, Recommendation] = {}; priority_list: List[tuple[int, str, float]] = []
    for topic_id in sorted(list(profile.misconceptions)): priority_list.append((topic_id, "misconception", 1.0))
    for topic_id in sorted(list(profile.knowledgeGaps)): priority_list.append((topic_id, "knowledge_gap", 0.9))
    for topic_id in sorted(list(profile.needsReinforcement)): priority_list.append((topic_id, "reinforcement", 0.7))
    all_known_topic_ids = get_all_topic_ids(); assessed = profile.assessedTopics; unassessed = list(all_known_topic_ids - assessed); random.shuffle(unassessed)
    for topic_id in unassessed[:2]: priority_list.append((topic_id, "new_topic", 0.5))
    processed_content_ids = set()
    for topic_id, reason_code, base_score in priority_list:
        if len(recommendations_map) >= limit: break
        matching_content = []; random.shuffle(candidate_content)
        for content in candidate_content:
            if content.contentId not in processed_content_ids and topic_id in content.relatedTopicIds: matching_content.append(content)
        if matching_content:
            selected_content = matching_content[0]; score = base_score + random.uniform(0, 0.01)
            recommendations_map[selected_content.contentId] = Recommendation( contentId=selected_content.contentId, contentType=selected_content.contentType, title=selected_content.title, description=selected_content.description or f"Learn about {selected_content.title}", relevanceScore=min(max(score, 0.0), 1.0), reason=_create_reason(reason_code, topic_id), relatedTopicIds=selected_content.relatedTopicIds )
            processed_content_ids.add(selected_content.contentId)
    if len(recommendations_map) < limit:
        proficient_topics_list = sorted(list(profile.proficientTopics)); random.shuffle(proficient_topics_list)
        for topic_id in proficient_topics_list:
             if len(recommendations_map) >= limit: break
             random.shuffle(candidate_content)
             for content in candidate_content:
                if content.contentId not in processed_content_ids and topic_id in content.relatedTopicIds:
                    score = 0.3 + random.uniform(0, 0.01)
                    recommendations_map[content.contentId] = Recommendation( contentId=content.contentId, contentType=content.contentType, title=content.title, description=content.description or f"Explore {content.title}", relevanceScore=score, reason=_create_reason("proficient_explore", topic_id), relatedTopicIds=content.relatedTopicIds )
                    processed_content_ids.add(content.contentId); break # Found one for this proficient topic
    final_recommendations = sorted(recommendations_map.values(), key=lambda r: r.relevanceScore, reverse=True)
    return final_recommendations[:limit]