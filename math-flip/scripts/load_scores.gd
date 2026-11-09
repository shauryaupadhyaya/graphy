extends Panel

@onready var score: Label = $InnerPanel/Score
@onready var multiplier: Label = $InnerPanel/Multiplier
@onready var total: Label = $InnerPanel/Total
@onready var questions: Label = $InnerPanel/Questions

# diff float values:
# easy: 1x
# medium: 1.5x
# hard: 2x
func _load_scores() -> void:
	score.text = str("Score: ", Manager.score)
	questions.text = str("Qs Score: ", Manager.questions_score)
	multiplier.text = str("Difficulty: ",str(Manager.difficulty), "x")
	total.text = str("Total Score: ", Manager.total_score * Manager.difficulty)

func _input(event: InputEvent) -> void:
	if event.is_action("ui_accept") && self.visible:
		get_tree().change_scene_to_file("res://scenes/difficulty_menu.tscn")
