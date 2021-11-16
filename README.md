# vermon-core-entities
Entities, Extensions, Filters used in sermon

* 0.5.17 * NPM audit fix; 
* 0.5.16 * Better structuring of NodeDetector, (ip, uptime, mac address...);  
* 0.5.15 * Added NodeEnvironment and NodeDetetor;  
* 0.5.14 * (Planned), MQTTNotifier and MQTTDetector;  
* 0.5.13 * (WIP) Bug fixes RequestReplyWorker should take a full path script, StompDetector should not propagate by default (new internal Detector event 'hasSkipped'); started creating documentation; created a new Filter, ObjectKeyValueFilter, where you specify the Key/Value to filter on the newState;  
* 0.5.12 * Finished implementation of RequestReplyWorker;  
* 0.5.11 * Started RequestReplyWorker (Notifier), WIP;  
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
