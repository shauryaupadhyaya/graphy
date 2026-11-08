extends Control


func _on_easy_pressed() -> void:
	Manager.difficulty = 1.0
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_medium_pressed() -> void:
	Manager.difficulty = 1.5
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_hard_pressed() -> void:
	Manager.difficulty = 2.0
	get_tree().change_scene_to_file("res://scenes/game.tscn")
