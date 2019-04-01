# vermon-core-entities
Entities, Extensions, Filters used in sermon

* 0.5.11 * (Planned), to add a vermon web example with simple html sending message, and backend subscriber receiving it;  
* 0.5.10 * Fixed Stomp Notifier bug, JSON object needed to be stringified before putting in queue;  
* 0.5.9 * Fixed Notifier bug which was attempting to send a message to queue before creating a connection;  
* 0.5.8 * Fixed Notifier bug which was sending extra messages to queue;  
* 0.5.7 * Added additional logs for EntitiesFactory when extending new plugin classes;  
* 0.5.6 * added option for SystemEnvironment to have interval < 0, to cover cases where classes inheriting have a way of not being bothered by the underlying SystemEnvironment commands, because these propagate changes to the detectors which might be unwanted;  
* 0.5.5 * Bug fix, added StompNotifier to list of classes which can be used in config;  
* 0.5.4 * Created StompNotifier (publisher) and tests;  
* 0.5.3 * Created StompDetector (subscriber) and tests;  
* 0.5.2 * Additional minor fixes;  
* 0.5.1 * Fix, included core.utils;  
* 0.5.0 * First version;  
