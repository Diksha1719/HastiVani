import re
from typing import List, Tuple, Dict, Any

class SentenceComposer:
    """
    Intelligent ISL Gloss to Natural English Sentence Composer.
    Transforms sequences of Indian Sign Language gesture tokens into
    fluent, grammatically accurate English sentences with proper punctuation.
    """

    GREETINGS = {"Hello", "Good"}
    POLITENESS = {"Please", "Thank You", "Sorry"}
    AFFIRMATIONS = {"Yes", "No", "OK", "Good"}
    NEEDS = {"Water", "Food", "Help", "Stop"}
    PRONOUNS = {"I", "You"}

    # Common multi-sign idiom mappings
    IDIOM_PATTERNS: Dict[Tuple[str, ...], Dict[str, Any]] = {
        ("Hello", "Help", "Please"): {
            "sentence": "Hello, I need help, please.",
            "alternatives": ["Hello! Could you please help me?", "Hello, can someone assist me?"]
        },
        ("Hello", "I", "Help", "Please"): {
            "sentence": "Hello, I need assistance, please.",
            "alternatives": ["Hello, could you please help me?", "Hello! I am requesting help."]
        },
        ("Water", "Please"): {
            "sentence": "Could I please have some water?",
            "alternatives": ["I would like some water, please.", "Please give me water."]
        },
        ("Food", "Please"): {
            "sentence": "Could I please have some food?",
            "alternatives": ["I am hungry and need some food, please.", "Please provide food."]
        },
        ("Help", "Please"): {
            "sentence": "Please help me.",
            "alternatives": ["I urgently need assistance, please.", "Could you please help me?"]
        },
        ("Stop", "Please"): {
            "sentence": "Please stop / wait a moment.",
            "alternatives": ["Could you please stop?", "Please wait right here."]
        },
        ("I", "Water", "Please"): {
            "sentence": "I would like some water, please.",
            "alternatives": ["Could I please have water?", "I am thirsty and need water."]
        },
        ("I", "Food", "Please"): {
            "sentence": "I would like some food, please.",
            "alternatives": ["Could I please have food?", "I need something to eat, please."]
        },
        ("I", "Help", "Please"): {
            "sentence": "I need help, please.",
            "alternatives": ["Could you please help me?", "I require assistance."]
        },
        ("I", "Sorry"): {
            "sentence": "I am very sorry.",
            "alternatives": ["I apologize sincerely.", "Please forgive me."]
        },
        ("You", "Good", "Thank You"): {
            "sentence": "You are very kind, thank you!",
            "alternatives": ["Thank you, you did great!", "You are good, thank you!"]
        },
        ("You", "Help", "Please"): {
            "sentence": "Could you please help me?",
            "alternatives": ["Can you assist me, please?", "Would you be able to help?"]
        },
        ("Yes", "Thank You"): {
            "sentence": "Yes, thank you very much.",
            "alternatives": ["Yes, thank you!", "Yes, that would be wonderful."]
        },
        ("No", "Thank You"): {
            "sentence": "No, thank you.",
            "alternatives": ["No thank you, I am okay.", "No thanks."]
        },
        ("Sorry", "Thank You"): {
            "sentence": "I am sorry, but thank you.",
            "alternatives": ["I apologize, and thank you.", "Sorry for the trouble, thank you."]
        },
        ("OK", "Thank You"): {
            "sentence": "Everything is okay, thank you.",
            "alternatives": ["I am fine, thank you!", "All good, thank you."]
        },
        ("Food", "Water", "Please"): {
            "sentence": "Could I please have food and water?",
            "alternatives": ["I need food and water, please.", "Please give me food and water."]
        },
        ("Hello", "Thank You"): {
            "sentence": "Hello, thank you for being here.",
            "alternatives": ["Hello and thank you!", "Greetings, thank you."]
        },
        ("Sorry", "Help", "Please"): {
            "sentence": "Sorry to bother you, could you please help me?",
            "alternatives": ["I am sorry, I need help please.", "Excuse me, could you assist me?"]
        },
        ("I Love You", "Thank You"): {
            "sentence": "I love you, thank you so much!",
            "alternatives": ["I love you! Thank you!", "Sending love and thanks!"]
        },
        ("Hello", "I Love You"): {
            "sentence": "Hello, I love you!",
            "alternatives": ["Greetings, I love you!", "Hello! Sending you love."]
        }
    }

    # Single token natural translations
    SINGLE_TOKEN_MAP = {
        "Hello": ("Hello! Welcome.", ["Hi there!", "Greetings!"]),
        "Thank You": ("Thank you very much.", ["Thanks a lot!", "Thank you!"]),
        "Yes": ("Yes, I agree.", ["Yes, absolutely.", "Yes."]),
        "No": ("No, thank you.", ["No, I decline.", "No."]),
        "Help": ("I need assistance.", ["Please help me.", "Can someone help?"]),
        "Please": ("Please, if you could.", ["Please.", "Kindly assist."]),
        "Sorry": ("I am sorry.", ["My apologies.", "I apologize."]),
        "Water": ("I would like some water.", ["Water, please.", "Could I have water?"]),
        "Food": ("I need food.", ["I would like something to eat.", "Food, please."]),
        "Good": ("That is good / well done.", ["Very good!", "Everything is good."]),
        "Stop": ("Please stop / wait.", ["Stop right there.", "Hold on a moment."]),
        "I": ("I / Me.", ["Speaking about myself.", "I am here."]),
        "You": ("You / Yourself.", ["Referring to you.", "You."]),
        "OK": ("Everything is okay.", ["I am fine.", "All good."]),
        "I Love You": ("I love you.", ["I love you so much!", "Love you!"])
    }

    def compose(self, tokens: List[str]) -> Tuple[str, List[str], bool]:
        """
        Takes an ordered list of gesture tokens and composes a fluent English sentence.
        Returns: (composed_sentence, alternatives_list, is_question)
        """
        # Filter out empty or noise tokens
        clean_tokens = [t.strip() for t in tokens if t and t.strip() and t.strip() not in ("Ready", "No Hand")]

        if not clean_tokens:
            return "Position hand to begin forming a sentence.", [], False

        # Single token handling
        if len(clean_tokens) == 1:
            token = clean_tokens[0]
            if token in self.SINGLE_TOKEN_MAP:
                main_trans, alts = self.SINGLE_TOKEN_MAP[token]
                return main_trans, alts, False
            return f"{token}.", [], False

        # Check exact idiom / pattern matches
        token_tuple = tuple(clean_tokens)
        if token_tuple in self.IDIOM_PATTERNS:
            match = self.IDIOM_PATTERNS[token_tuple]
            sentence = match["sentence"]
            is_q = sentence.endswith("?")
            return sentence, match.get("alternatives", []), is_q

        # Dynamic Rule-Based Synthesis
        sentence, alternatives, is_q = self._synthesize_dynamic(clean_tokens)
        return sentence, alternatives, is_q

    def _synthesize_dynamic(self, tokens: List[str]) -> Tuple[str, List[str], bool]:
        """
        Rule-based ISL grammar smoothing:
        1. Segregate greeting, subject, actions, politeness, affirmation.
        2. Re-order according to standard English Subject-Verb-Object + Courtesy structure.
        """
        has_hello = "Hello" in tokens
        has_please = "Please" in tokens
        has_thanks = "Thank You" in tokens
        has_sorry = "Sorry" in tokens
        has_yes = "Yes" in tokens
        has_no = "No" in tokens
        has_ok = "OK" in tokens
        has_good = "Good" in tokens
        has_water = "Water" in tokens
        has_food = "Food" in tokens
        has_help = "Help" in tokens
        has_stop = "Stop" in tokens
        has_i = "I" in tokens
        has_you = "You" in tokens
        has_ily = "I Love You" in tokens

        parts = []
        is_question = False

        # 1. Opening: Greetings or Apologies
        if has_hello:
            parts.append("Hello")
        if has_sorry and not has_hello:
            parts.append("I am sorry")

        # 2. Main intent / Core clause
        core_intent = []
        if has_water and has_food:
            core_intent.append("some food and water")
        elif has_water:
            core_intent.append("some water")
        elif has_food:
            core_intent.append("some food")

        if has_help:
            if has_you:
                is_question = True
                intent_clause = "could you please help me"
            elif has_i or not has_you:
                intent_clause = "I need assistance"
            else:
                intent_clause = "help is needed"
        elif has_stop:
            intent_clause = "please wait / stop"
        elif core_intent:
            items = core_intent[0]
            if has_you:
                is_question = True
                intent_clause = f"could you bring {items}"
            elif has_no:
                intent_clause = f"I do not need {items}"
            else:
                intent_clause = f"I would like {items}"
        elif has_good:
            if has_you:
                intent_clause = "you are doing very well"
            elif has_i:
                intent_clause = "I am doing well"
            else:
                intent_clause = "that is good"
        elif has_ok:
            if has_you:
                intent_clause = "are you okay"
                is_question = True
            else:
                intent_clause = "everything is okay"
        elif has_yes:
            intent_clause = "I agree"
        elif has_no:
            intent_clause = "I decline"
        elif has_ily:
            intent_clause = "I love you"
        else:
            # Fallback join remaining words
            filtered = [t for t in tokens if t not in {"Hello", "Please", "Thank You", "Sorry"}]
            intent_clause = " ".join(filtered).lower() if filtered else "request received"

        # Combine
        if parts:
            main_sentence = f"{parts[0]}, {intent_clause}"
        else:
            main_sentence = intent_clause.capitalize()

        # 3. Politeness closures
        if has_please and "please" not in main_sentence.lower():
            main_sentence += ", please"
        if has_thanks:
            main_sentence += ". Thank you!"
        elif has_sorry and has_hello:
            main_sentence += " (apologies for the trouble)."
        elif is_question:
            main_sentence += "?"
        else:
            if not main_sentence.endswith((".", "!", "?")):
                main_sentence += "."

        # Capitalize first letter
        main_sentence = main_sentence[0].upper() + main_sentence[1:]

        # Alternatives
        alternatives = [
            " ".join(tokens),  # Raw sign gloss
            f"Sign translation: {main_sentence}"
        ]

        return main_sentence, alternatives, is_question

sentence_composer = SentenceComposer()
