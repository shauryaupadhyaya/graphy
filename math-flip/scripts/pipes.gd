extends Area2D

@export var speed: float = 200.0
@export var game_started: bool = false

func _process(delta: float) -> void:
	if game_started:
		position.x -= (speed * delta)
	
