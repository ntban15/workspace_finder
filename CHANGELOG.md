# 2018-05-17

* Restructure project folders
* Change Root Navigator to SwitchNavigator, group FriendsScreen and HotgirlScreen into a stack that is a child of root. Add AuthLoadingScreen to handle app restart
* Constants, constants and constants (color, screen names, firebase config, etc.)
* Add persistence. App can handle restart now
* Clicking on Hotgirl button in FriendsScreen now require a login
* Fix FriendsSaga flow
* Add username global state so posting comments can make use of it