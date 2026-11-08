extends Timer


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	match Manager.difficulty:
		1.0:
			wait_time = 10
		1.5:
			wait_time = 15
		2.0:
			wait_time = 20
