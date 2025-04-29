# finlit-backend/quiz_logic.py
from typing import List, Dict, Set, Optional
from models import QuizAnswer, UserProfile
from data_store import get_correct_answer, get_all_topic_ids

HIGH_CONFIDENCE_THRESHOLD = 4
LOW_CONFIDENCE_THRESHOLD = 2

def build_profile_from_quiz(user_id: str, quiz_answers: List[QuizAnswer]) -> UserProfile:
    profile = UserProfile(userId=user_id); topic_results: Dict[int, List[Dict]] = {}
    for ans in quiz_answers:
        topic_id = ans.topicId; profile.assessedTopics.add(topic_id)
        if topic_id not in topic_results: topic_results[topic_id] = []
        correct_answer_value = get_correct_answer(ans.questionId)
        if correct_answer_value is None: print(f"Skipping Q {ans.questionId}: missing correct answer."); continue
        is_correct = (ans.selectedAnswerValue == correct_answer_value)
        topic_results[topic_id].append({"is_correct": is_correct, "confidence": ans.confidence})
    for topic_id, results in topic_results.items():
        if not results: continue
        total = len(results); correct_count = sum(1 for r in results if r['is_correct']); avg_confidence = sum(r['confidence'] for r in results) / total
        profile.topicKnowledge[topic_id] = correct_count / total; profile.topicConfidence[topic_id] = avg_confidence
        is_generally_correct = profile.topicKnowledge[topic_id] >= 0.6; is_highly_confident = avg_confidence >= HIGH_CONFIDENCE_THRESHOLD; is_low_confident = avg_confidence <= LOW_CONFIDENCE_THRESHOLD
        if not is_generally_correct and is_highly_confident: profile.misconceptions.add(topic_id)
        elif not is_generally_correct: profile.knowledgeGaps.add(topic_id)
        elif is_generally_correct and is_low_confident: profile.needsReinforcement.add(topic_id)
        elif is_generally_correct and is_highly_confident: profile.proficientTopics.add(topic_id)
    return profile