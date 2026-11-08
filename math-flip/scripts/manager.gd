extends Node

@export var score: int = 0
@export var player_alive: bool = true

# diff float values:
# easy: 1x
# medium: 1.5x
# hard: 2x

@export var difficulty: float = 1.0

func _increment_score(value) -> void:
	score += value
