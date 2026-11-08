extends Node

# todo:
# make function to increment question points - DONE
# make function to check answer against stored - DONE
# make function to generate questions for topics - DONE

var questions_answerd: int = 0 # check the number questions answered by user
var pipes_passed: int = 0 # counts pipe passed by user for regenerating questions
var pipes_per_questions: int = 10 # stores number of pipes to unlock after each q, easy: questions show up every 15, medium: 13, hard: 10
var questions_unlocked: int = 0 # stores number of questions answered

var questions_data: Dictionary
var question: Dictionary

func _ready() -> void:
	var file = FileAccess.open("res://questions.json", FileAccess.READ)
	if file == null:
		print("failed to find file")
	var json_text = file.get_as_text()
	file.close()
	questions_data = JSON.parse_string(json_text)
	if questions_data == null:
		print("Invalid JSON")
		return

func _increment_points(amount: int) -> void:
	Manager.questions_score += float(amount * Manager.difficulty)
	Manager.total_score = Manager.score + Manager.questions_score

func _get_question(difficulty: String) -> Dictionary:
	var difficulty_questions = questions_data["questions"][difficulty]
	var random_question = difficulty_questions.pick_random()
	question = random_question
	return random_question

func _check_answer(question_tocheck: Dictionary, chosen_answer: int) -> bool:
	return question_tocheck["correct_answer"] == chosen_answer
