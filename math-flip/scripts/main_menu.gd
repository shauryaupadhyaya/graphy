extends Control

#switch to game when start button pressed
func _on_start_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")

# switch to settings menu when settings pressed
func _on_settings_pressed() -> void:
	print("settings pressed")
