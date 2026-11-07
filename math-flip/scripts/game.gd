extends Node2D

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var player: CharacterBody2D = $Player
@onready var outer_panel_pause: Panel = $"Control/OuterPanel-Pause"
@onready var bird: AnimatedSprite2D = $Player/Bird
@onready var sky: Parallax2D = $Sky
@onready var clouds_back: Parallax2D = $Clouds_Back
@onready var clouds_front: Parallax2D = $Clouds_Front
@onready var pipes: Node2D = $Pipes

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	animation_player.play("3...2...1")
	outer_panel_pause.visible = false

func _on_animation_player_animation_finished(anim_name: StringName) -> void:
	if anim_name == "3...2...1":
		player.is_paused = false
		pipes.game_started = true

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel"):
		if outer_panel_pause.visible:
			outer_panel_pause.visible = false
			if animation_player.is_playing():
				player.is_paused = true
			else:
				player.is_paused = false
			_unpause_bg()
		elif not outer_panel_pause.visible:
			outer_panel_pause.visible = true
			player.is_paused = true
			_pause_bg()

func _pause_bg() -> void:
	sky.autoscroll = Vector2(0, 1)
	clouds_back.autoscroll = Vector2(1, 1)
	clouds_front.autoscroll = Vector2(1, 1)
	pipes.game_started = false
	bird.pause()

func _unpause_bg() -> void:
	sky.autoscroll = Vector2(-20, 1)
	clouds_back.autoscroll = Vector2(-50, 1)
	clouds_front.autoscroll = Vector2(-70, 1)
	bird.play("flap")
	pipes.game_started = true
