extends Node2D

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var player: CharacterBody2D = $Player

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	animation_player.play("3...2...1")

func _on_animation_player_animation_finished(anim_name: StringName) -> void:
	if anim_name == "3...2...1":
		player.is_paused = false
