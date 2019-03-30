# vermon-core-entities
Entities, Extensions, Filters used in sermon

* 0.5.7 * (Planned), to add a vermon web example with simple html sending message, and backend subscriber receiving it;  
* 0.5.6 * added option for SystemEnvironment to have interval < 0, to cover cases where classes inheriting have a way of not being bothered by the underlying SystemEnvironment commands, because these propagate changes to the detectors which might be unwanted;  
* 0.5.5 * Bug fix, added StompNotifier to list of classes which can be used in config;  
* 0.5.4 * Created StompNotifier (publisher) and tests;  
* 0.5.3 * Created StompDetector (subscriber) and tests;  
* 0.5.2 * Additional minor fixes;  
* 0.5.1 * Fix, included core.utils;  
* 0.5.0 * First version;  
