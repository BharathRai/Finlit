# finlit-backend/data_store.py
import random
from collections import defaultdict
from typing import Dict, List, Set, Optional
from models import UserProfile, ContentItem, QuizQuestionData, RelatedResource

# --- WARNING: IN-MEMORY STORAGE - NOT FOR PRODUCTION ---

# --- Dummy Data ---
user_profiles: Dict[str, UserProfile] = {}

# !!! ADD MORE CONTENT ITEMS AND REPLACE PLACEHOLDER ImageURLs !!!
content_metadata: List[ContentItem] = [ # Corrected comment syntax
     ContentItem(
        contentId='topic-0', contentType='topic_page', title='Saving', relatedTopicIds=[0], description="Learn the basics of setting money aside.", difficulty='beginner',
        relatedResources=[ RelatedResource(title="Importance of Saving Money", url="https://www.investopedia.com/articles/personal-finance/080716/importance-saving-money.asp", source="Investopedia", imageUrl="https://via.placeholder.com/100x50.png/00aabb/ffffff?text=SavingIcon"), RelatedResource(title="Savings Goal Calculator", url="https://www.calculator.net/savings-goal-calculator.html", source="Calculator.net")]
     ),
    ContentItem(
        contentId='topic-1', contentType='topic_page', title='Budgeting', relatedTopicIds=[1, 16], description="Create a plan for your money.", difficulty='beginner',
        relatedResources=[ RelatedResource(title="How to Make a Budget", url="https://www.nerdwallet.com/article/finance/how-to-build-a-budget", source="NerdWallet", imageUrl="https://via.placeholder.com/100x50.png/0077cc/ffffff?text=NerdWallet"), RelatedResource(title="50/30/20 Budget Rule Explained", url="https://www.investopedia.com/ask/answers/022916/what-502030-budget-rule.asp", source="Investopedia", imageUrl="https://via.placeholder.com/100x50.png/00aaff/ffffff?text=Investopedia")]
    ),
    ContentItem(
        contentId='topic-3', contentType='topic_page', title='Emergency Fund', relatedTopicIds=[3], description="Prepare for unexpected expenses.", difficulty='beginner',
        relatedResources=[ RelatedResource(title="Emergency Fund: Why You Need One", url="https://www.consumerfinance.gov/ask-cfpb/what-is-an-emergency-fund-en-1710/", source="CFPB")]
    ),
    ContentItem(
        contentId='topic-9', contentType='topic_page', title='Stock Market', relatedTopicIds=[9, 18], description="Investing in company shares.", difficulty='intermediate',
         relatedResources=[ RelatedResource(title="Stock Market Basics", url="https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks", source="Investor.gov", imageUrl="https://via.placeholder.com/100x50.png/cccccc/000000?text=Investor.gov"), RelatedResource(title="Yahoo Finance - Market News", url="https://finance.yahoo.com/", source="Yahoo Finance", imageUrl="https://via.placeholder.com/100x50.png/5e0acc/ffffff?text=YahooFinance")]
    ),
    ContentItem(
        contentId='topic-13', contentType='topic_page', title='Credit Score Management', relatedTopicIds=[13], description="Understanding and improving your creditworthiness.", difficulty='intermediate',
        relatedResources=[ RelatedResource(title="What Is a Good Credit Score?", url="https://www.experian.com/blogs/ask-experian/what-is-a-good-credit-score/", source="Experian", imageUrl="https://via.placeholder.com/100x50.png/ff4500/ffffff?text=Experian"), RelatedResource(title="Check Your Free Credit Report", url="https://www.annualcreditreport.com", source="AnnualCreditReport.com")]
    ),
    ContentItem(
        contentId='topic-19', contentType='topic_page', title='Credit Card Management', relatedTopicIds=[19, 5], description="Using credit cards responsibly.", difficulty='beginner',
         relatedResources=[ RelatedResource(title="How Credit Cards Work", url="https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-en-353/", source="CFPB")]
    ),
     # !!! ADD YOUR ACTUAL CONTENT ITEMS AND RESOURCES HERE !!!
]

# === LARGE QUESTION POOL ===
# !!! IMPORTANT: Replace this sample with at least 50 actual, unique questions !!!
_full_question_pool_base: List[QuizQuestionData] = [
    # --- Add your 50+ unique questions here ---
    QuizQuestionData(id=101, topicId=1, text="Primary purpose of a budget?", options=[{'value': 'a', 'text': 'Track past spending.'}, {'value': 'b', 'text': 'Plan future spending/saving.'}, {'value': 'c', 'text': 'Eliminate discretionary spending.'}, {'value': 'd', 'text': 'Calculate net worth.'}], difficulty='beginner'),
    QuizQuestionData(id=102, topicId=3, text="Emergency fund covers how many months of *essential* expenses?", options=[{'value': 'a', 'text': '1'}, {'value': 'b', 'text': '1-2'}, {'value': 'c', 'text': '3-6'}, {'value': 'd', 'text': '12+'}], difficulty='beginner'),
    QuizQuestionData(id=105, topicId=19, text="Downside of minimum credit card payments?", options=[{'value': 'a', 'text': 'Improves utilization.'}, {'value': 'b', 'text': 'Avoids interest.'}, {'value': 'c', 'text': 'No score impact.'}, {'value': 'd', 'text': 'Pay much more interest.'}], difficulty='beginner'),
    QuizQuestionData(id=201, topicId=18, text="What is diversification in investing?", options=[{'value': 'a', 'text': 'All money in one stock.'}, {'value': 'b', 'text': 'Spread investments across assets.'}, {'value': 'c', 'text': 'Only savings accounts.'}, {'value': 'd', 'text': 'Timing the market.'}], difficulty='beginner'),
    QuizQuestionData(id=202, topicId=0, text="What does 'Pay Yourself First' mean?", options=[{'value': 'a', 'text': 'Spend on wants first.'}, {'value': 'b', 'text': 'Save portion of income first.'}, {'value': 'c', 'text': 'Lend to friends.'}, {'value': 'd', 'text': 'Pay favorite bills.'}], difficulty='beginner'),
    QuizQuestionData(id=203, topicId=13, text="Credit score used by lenders for?", options=[{'value': 'a', 'text': 'Determine income.'}, {'value': 'b', 'text': 'Assess repayment likelihood.'}, {'value': 'c', 'text': 'Verify identity.'}, {'value': 'd', 'text': 'Calculate net worth.'}], difficulty='beginner'),
    QuizQuestionData(id=204, topicId=5, text="Which strategy pays smallest debts first?", options=[{'value': 'a', 'text': 'Debt Avalanche'}, {'value': 'b', 'text': 'Debt Snowball'}, {'value': 'c', 'text': 'Debt Consolidation'}, {'value': 'd', 'text': 'Debt Settlement'}], difficulty='beginner'),
    QuizQuestionData(id=205, topicId=7, text="What is an insurance premium?", options=[{'value': 'a', 'text': 'Claim payout amount.'}, {'value': 'b', 'text': 'Regular payment for policy.'}, {'value': 'c', 'text': 'Deductible amount.'}, {'value': 'd', 'text': 'No-claim bonus.'}], difficulty='beginner'),
    QuizQuestionData(id=103, topicId=9, text="Single stock vs. mutual fund risk?", options=[{'value': 'a', 'text': 'Less risky'}, {'value': 'b', 'text': 'More risky'}, {'value': 'c', 'text': 'Guaranteed higher returns.'}, {'value': 'd', 'text': 'Only for retirement.'}], difficulty='intermediate'),
    QuizQuestionData(id=104, topicId=13, text="BIGGEST positive impact on credit score?", options=[{'value': 'a', 'text': 'On-time payments.'}, {'value': 'b', 'text': 'Many credit types.'}, {'value': 'c', 'text': 'Low balances.'}, {'value': 'd', 'text': 'Checking report.'}], difficulty='intermediate'),
    QuizQuestionData(id=200, topicId=4, text="Key difference: Traditional vs. Roth IRA/401(k)?", options=[{'value': 'a', 'text': 'Contribution limits.'}, {'value': 'b', 'text': 'Investment options.'}, {'value': 'c', 'text': 'When taxes are paid.'}, {'value': 'd', 'text': 'Matching rules.'}], difficulty='intermediate'),
    QuizQuestionData(id=301, topicId=7, text="Health insurance 'deductible'?", options=[{'value': 'a', 'text': 'Monthly premium.'}, {'value': 'b', 'text': 'Max insurance payout.'}, {'value': 'c', 'text': 'Your out-of-pocket before insurance pays.'}, {'value': 'd', 'text': 'Healthy habits discount.'}], difficulty='intermediate'),
    QuizQuestionData(id=302, topicId=2, text="What is 'compounding' in investing?", options=[{'value': 'a', 'text': 'Quick selling.'}, {'value': 'b', 'text': 'Earnings generating earnings.'}, {'value': 'c', 'text': 'Combining accounts.'}, {'value': 'd', 'text': 'Investment fee.'}], difficulty='intermediate'),
    QuizQuestionData(id=303, topicId=18, text="What is 'asset allocation'?", options=[{'value': 'a', 'text': 'Choosing one asset.'}, {'value': 'b', 'text': 'Dividing investments (stocks, bonds etc.).'}, {'value': 'c', 'text': 'Allocating for expenses.'}, {'value': 'd', 'text': 'Avoiding all risk.'}], difficulty='intermediate'),
    QuizQuestionData(id=304, topicId=8, text="'Equity' in homeownership?", options=[{'value': 'a', 'text': 'Total house value.'}, {'value': 'b', 'text': 'Mortgage payment amount.'}, {'value': 'c', 'text': 'Value minus mortgage owed.'}, {'value': 'd', 'text': 'Mortgage interest rate.'}], difficulty='intermediate'),
    QuizQuestionData(id=401, topicId=6, text="Marginal vs. effective tax rates?", options=[{'value': 'a', 'text': 'Income vs. sales.'}, {'value': 'b', 'text': 'Rate on last dollar vs. total tax/total income.'}, {'value': 'c', 'text': 'Same for most.'}, {'value': 'd', 'text': 'Effective always lower.'}], difficulty='advanced'),
    QuizQuestionData(id=402, topicId=14, text="'Power of attorney' purpose?", options=[{'value': 'a', 'text': 'Control investments after death.'}, {'value': 'b', 'text': 'Designate decision-maker if incapacitated.'}, {'value': 'c', 'text': 'Name beneficiaries.'}, {'value': 'd', 'text': 'Reduce estate taxes.'}], difficulty='advanced'),
    QuizQuestionData(id=403, topicId=12, text="'4% rule' related to?", options=[{'value': 'a', 'text': 'Savings rate.'}, {'value': 'b', 'text': 'Safe withdrawal rate in retirement.'}, {'value': 'c', 'text': 'Investment return type.'}, {'value': 'd', 'text': 'Roth contribution limit.'}], difficulty='advanced'),
    # ... (ensure you have at least 50 UNIQUE questions) ...
]
# --- TEMPORARY DUPLICATION (REMOVE WHEN YOU HAVE 50+ UNIQUE QUESTIONS) ---
_target_pool_size = 50; _full_question_pool = []; _temp_id_map = {}
temp_id_counter = 1000 # Start temp IDs higher to avoid clashes with real ones
if _full_question_pool_base:
    while len(_full_question_pool) < _target_pool_size:
        for q_orig in _full_question_pool_base:
            if len(_full_question_pool) >= _target_pool_size: break
            q_copy = q_orig.model_copy(); q_copy.id = temp_id_counter
            _full_question_pool.append(q_copy); _temp_id_map[temp_id_counter] = q_orig.id
            temp_id_counter += 1
else: print("WARNING: _full_question_pool_base is empty!")
# --- END TEMP DUPLICATION ---

# === CORRECT ANSWERS ===
# !!! ADD ALL CORRECT ANSWERS FOR YOUR UNIQUE QUESTIONS !!!
_correct_answers_base: Dict[int, str] = { 101: "b", 102: "c", 103: "b", 104: "a", 105: "d", 200: "c", 201: "b", 202: "b", 203: "b", 204: "b", 205: "b", 301: "c", 302: "b", 303: "b", 304: "c", 401: "b", 402: "b", 403: "b" }
# --- TEMP ANSWER GENERATION (REMOVE/ADJUST WITH UNIQUE QUESTIONS) ---
correct_answers: Dict[int, str] = {}
if _full_question_pool:
    for q in _full_question_pool:
        original_id = _temp_id_map.get(q.id, q.id) # Find original ID for temp IDs
        correct_answer = _correct_answers_base.get(original_id)
        if correct_answer: correct_answers[q.id] = correct_answer
        else: print(f"WARN: Missing base answer for original ID {original_id} (from {q.id})"); correct_answers[q.id] = q.options[0]['value'] # Default to 'a' if missing - FIX THIS
else: print("WARN: Correct answers map empty.")
# --- END TEMP ANSWER GEN ---


# --- Data Access Functions ---
def get_user_profile(user_id: str) -> Optional[UserProfile]: return user_profiles.get(user_id)
def save_user_profile(profile: UserProfile): user_profiles[profile.userId] = profile; print(f"Saved profile for: {profile.userId}")
def get_all_content() -> List[ContentItem]: return content_metadata

# --- CORRECTED FUNCTION ---
def get_correct_answer(question_id: int) -> Optional[str]:
    """Gets the correct answer value for a given question ID."""
    answer = correct_answers.get(question_id) # Get the answer (returns None if key not found)
    if answer is None:
        # Print a warning if the key was not found in the dictionary
        print(f"WARN: Correct answer ID {question_id} not found!")
    # Return the result - will be the answer string if found, or None if not found
    return answer
# --- END CORRECTION ---

def get_all_quiz_questions() -> List[QuizQuestionData]: return _full_question_pool # Use the (potentially duplicated) pool

def select_initial_quiz_set(num_questions: int = 10) -> List[QuizQuestionData]:
    """Selects a balanced subset (default 10) for the initial quiz."""
    full_pool = get_all_quiz_questions()
    if not full_pool: print("WARN: Full question pool empty!"); return []
    if len(full_pool) <= num_questions: print(f"WARN: Pool size {len(full_pool)} <= requested {num_questions}. Returning all."); return random.sample(full_pool, len(full_pool))
    # --- Selection Logic (same as before) ---
    by_difficulty = defaultdict(list); [by_difficulty[q.difficulty or 'beginner'].append(q) for q in full_pool]
    selected_questions = []; selected_ids = set()
    target_beginner = int(num_questions * 0.50); target_intermediate = int(num_questions * 0.40); target_advanced = num_questions - target_beginner - target_intermediate
    target_beginner = min(target_beginner, len(by_difficulty.get('beginner', []))); target_intermediate = min(target_intermediate, len(by_difficulty.get('intermediate', []))); target_advanced = min(target_advanced, len(by_difficulty.get('advanced', [])))
    total_selected_target = target_beginner + target_intermediate + target_advanced
    def select_group(group: List[QuizQuestionData], count: int, priority_pass=False):
        if not group or count <= 0: return
        nonlocal selected_questions, selected_ids; group_copy = list(group); random.shuffle(group_copy)
        topic_counts = defaultdict(int); limit_per_topic = 1 if priority_pass else 2; added_in_pass = 0
        for q in group_copy: # First pass for topic variety
            if added_in_pass >= count: break
            if q.id not in selected_ids and topic_counts[q.topicId] < limit_per_topic: selected_questions.append(q); selected_ids.add(q.id); topic_counts[q.topicId] += 1; added_in_pass += 1
        remaining_needed = count - added_in_pass
        if remaining_needed > 0 and not priority_pass: # Second pass random fill
            random.shuffle(group_copy)
            for q in group_copy:
                if remaining_needed <= 0: break
                if q.id not in selected_ids: selected_questions.append(q); selected_ids.add(q.id); remaining_needed -= 1
    select_group(by_difficulty.get('beginner', []), target_beginner, priority_pass=True); select_group(by_difficulty.get('intermediate', []), target_intermediate, priority_pass=True); select_group(by_difficulty.get('advanced', []), target_advanced, priority_pass=True)
    needed = total_selected_target - len(selected_questions) # Fill remaining if needed
    if needed > 0: select_group(by_difficulty.get('beginner', []), needed); needed = total_selected_target - len(selected_questions)
    if needed > 0: select_group(by_difficulty.get('intermediate', []), needed); needed = total_selected_target - len(selected_questions)
    if needed > 0: select_group(by_difficulty.get('advanced', []), needed)
    needed = num_questions - len(selected_questions) # Final random fill
    if needed > 0: print(f"WARN: Topping up {needed} questions randomly."); random.shuffle(full_pool); [selected_questions.append(q) or selected_ids.add(q.id) for q in full_pool if q.id not in selected_ids and len(selected_questions) < num_questions]
    random.shuffle(selected_questions); final_set = selected_questions[:num_questions]; print(f"Selected {len(final_set)} questions."); return final_set

_topic_names: Dict[int, str] = { 0: "Saving", 1: "Budgeting", 2: "Investing", 3: "Emergency Fund", 4: "Retirement Planning", 5: "Debt Management", 6: "Tax Planning", 7: "Insurance", 8: "Real Estate", 9: "Stock Market", 10: "Cryptocurrency", 11: "Personal Loans", 12: "Financial Independence", 13: "Credit Score Management", 14: "Estate Planning", 15: "Financial Education", 16: "Budget Allocation", 17: "Saving for College", 18: "Investment Risk", 19: "Credit Card Management" }
def get_topic_name_from_id(topic_id: int) -> str: return _topic_names.get(topic_id, f"Unknown Topic {topic_id}")
def get_all_topic_ids() -> Set[int]: all_ids = set(_topic_names.keys()); [all_ids.update(item.relatedTopicIds) for item in content_metadata]; [all_ids.add(q.topicId) for q in get_all_quiz_questions()]; return all_ids