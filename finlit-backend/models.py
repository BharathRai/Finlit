# finlit-backend/models.py
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Set, Any

# --- Request Models ---
class QuizAnswer(BaseModel):
    questionId: int; topicId: int; selectedAnswerValue: str
    confidence: int = Field(..., ge=1, le=5)
class QuizSubmissionPayload(BaseModel): answers: List[QuizAnswer]

# --- Data/Profile Models ---
class UserProfile(BaseModel):
    userId: str; topicKnowledge: Dict[int, float] = Field(default_factory=dict)
    topicConfidence: Dict[int, float] = Field(default_factory=dict)
    misconceptions: Set[int] = Field(default_factory=set)
    needsReinforcement: Set[int] = Field(default_factory=set)
    knowledgeGaps: Set[int] = Field(default_factory=set)
    proficientTopics: Set[int] = Field(default_factory=set)
    assessedTopics: Set[int] = Field(default_factory=set)
class RelatedResource(BaseModel):
    title: str; url: str; source: Optional[str] = None; imageUrl: Optional[str] = None # Added field
class ContentItem(BaseModel):
    contentId: str; contentType: str; title: str; description: str = ""
    relatedTopicIds: List[int] = Field(default_factory=list); difficulty: Optional[str] = None
    relatedResources: List[RelatedResource] = Field(default_factory=list) # Includes imageUrl now
class QuizQuestionData(BaseModel):
    id: int; topicId: int; text: str; options: List[Dict[str, str]]
    difficulty: Optional[str] = 'beginner'

# --- Response Models ---
class Recommendation(BaseModel):
    contentId: str; contentType: str; title: str; description: str
    relevanceScore: float; reason: str; relatedTopicIds: List[int]