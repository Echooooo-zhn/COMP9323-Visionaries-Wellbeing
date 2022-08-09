# Folder Structure

```
backend
┣ app
┃ ┣ auth # The auth module
┃ ┃ ┣ __init__.py
┃ ┃ ┣ views.py 			# Routes of this module
┃ ┃ ┣ controllers.py 	# Manipulate database
┃ ┃ ┣ schemas.py 		# Restful API Schemas
┃ ┃ ┗ models.py 		# Datebase Schemas related to this module
┃ ┃
┃ ┃ ..............
┃ ┃
┃ ┣ app.py 			# App factory + Module registration
┃ ┣ commands.py 	# Cli commands
┃ ┣ extensions.py 	# Instantiated instance, e.g. db
┃ ┣ settings.py 	# ENV variables
┃ ┗ utils.py 		# Utility functions
┃   ┣ seed_datebase.py		# Script to seed the database
┃   ┗ google_meeting.py		# Helper to schedule meetings
┃
┣ README.md
┣ autoapp.py 			# App entry point
┣ config.py 			# Run-time config
┣ .env 					# Environment variables
┣ seeding_data.json 	# Data to seed the database
┗ requirements.txt 		# Python dependencies
```