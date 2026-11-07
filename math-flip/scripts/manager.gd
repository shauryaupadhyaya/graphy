extends Node

@export var score: int = 0
@export var player_alive: bool = true

func _increment_score(value) -> void:
	score += value
