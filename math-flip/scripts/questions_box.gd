extends Control

# todo:
# hide panel on load. only show panel when QuestionManager pipes passed is more than questions unlocked + 1 times 10 - done
# get questions from question manager - done
# load options - done
# if timer runs out deduct 2 from score for easy, 3 for medium, 5 for hard
# give 1 for easy, 2 for medium and 3 points for hard

@onready var question_text: Label = $QuestionBG/Question
@onready var score_counter: Label = $"../ScoreCounter"
#@onready var option_1: Button = $QuestionBG/Option1
#@onready var option_2: Button = $QuestionBG/Option2
#@onready var option_3: Button = $QuestionBG/Option3
#@onready var option_4: Button = $QuestionBG/Option4
@onready var options: Array = [$QuestionBG/Option1, $QuestionBG/Option2, $QuestionBG/Option3, $QuestionBG/Option4]
@onready var center_container: CenterContainer = $CenterContainer
@onready var question_timer_bar: TextureProgressBar = $CenterContainer/QuestionTimeBar
@onready var player: CharacterBody2D = $"../../Player"
@onready var spawner: Node2D = $"../../Spawner"
@onready var bird: AnimatedSprite2D = $"../../Player/Bird"
@onready var sky: Parallax2D = $"../../Sky"
@onready var clouds_back: Parallax2D = $"../../Clouds_Back"
@onready var clouds_front: Parallax2D = $"../../Clouds_Front"
@onready var question_timer: Timer = $"../../QuestionTimer"
var question: Dictionary = {}
func _ready() -> void:
	hide()
	QuestionManager.connect("questions_unlocked", _load_question)
	question_timer.connect("timeout", _timer_out)
	for i in range(options.size()):
		options[i].connect("pressed", _check_answer.bind(i))

func _load_question() -> void:
	@warning_ignore("unused_variable")
	match Manager.difficulty:
		1.0:
			question = QuestionManager._get_question("easy")
		1.5:
			question = QuestionManager._get_question("medium")
		2.0:
			question = QuestionManager._get_question("hard")
		_:
			print("beep...invalid difficulty")
	 #{
		#"id": 1,
		#"topic": "algebra",
		#"question": "Solve for x: 5x = 20",
		#"options": [
		  #"2",
		  #"3",
		  #"4",
		  #"5"
		#],
		#"correct_answer": 2
	  #},
	question_text.text = question["question"]
	for i in range(question["options"].size()):
		options[i].text = str(question["options"][i])
	show()
	spawner.spawn = false
	_show_panel()
	


func _show_panel() -> void:
	sky.autoscroll = Vector2(0, 1)
	clouds_back.autoscroll = Vector2(1, 1)
	clouds_front.autoscroll = Vector2(1, 1)
	bird.stop()
	player.is_paused = true
	spawner.spawn = false
	spawner._stop_pipes()
	_start_timer()

func _hide_panel() -> void:
	sky.autoscroll = Vector2(-20, 1)
	clouds_back.autoscroll = Vector2(-50, 1)
	clouds_front.autoscroll = Vector2(-70, 1)
	bird.play("flap")
	player.is_paused = false
	spawner.spawn = true
	spawner._start_pipes()
	_stop_timer()
	player.set_collision_layer_value(1, false)
	player.set_collision_mask_value(1, false)
	await get_tree().create_timer(0.5).timeout
	player.set_collision_layer_value(1, true)
	player.set_collision_mask_value(1, true)
	
func _start_timer() -> void:
	question_timer.start()

func _stop_timer() -> void:
	question_timer.stop()

# if timer runs out deduct 2 from score for easy, 3 for medium, 5 for hard
# give 1 for easy, 2 for medium and 3 points for hard for answering correctly
func _timer_out() -> void:
	match Manager.difficulty:
		1.0:
			Manager.score -= 2
		1.5:
			Manager.score -= 3
		2.0:
			Manager.score -= 5
	_update_score()
	_hide_panel()
	hide()

func _update_score() -> void:
	Manager.total_score = Manager.score + Manager.questions_score
	score_counter.text = str(Manager.total_score)

func _process(_delta: float) -> void:
	question_timer_bar.value = (question_timer.time_left / question_timer.wait_time) * 100

func _check_answer(index: int) -> void:
	var isCorrect: bool = false
	isCorrect = QuestionManager._check_answer(question, index)
	if isCorrect:
		_hide_panel()
		_stop_timer()
		_awardPoints()
		hide()
	pass
	#todo: loop through available options, find which one matches answer and then check
# todo: connect answers to questions
# todo: restart game

func _awardPoints() -> void:
	match Manager.difficulty:
		1.0:
			Manager.score += 1
		1.5:
			Manager.score += 2
		2.0:
			Manager.score += 3
	Manager.total_score = Manager.score + Manager.questions_score
	score_counter.text = str(Manager.total_score)
