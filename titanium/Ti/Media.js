define(["Ti/_/Evented", "Ti/_/lang", "Ti/Blob"], function(Evented, lang, Blob) {

	return lang.setObject("Ti.Media", Evented, {

		constants: {
			UNKNOWN_ERROR: 0,
			DEVICE_BUSY: 1,
			NO_CAMERA: 2,
			NO_VIDEO: 3,

			VIDEO_CONTROL_DEFAULT: 1,
			VIDEO_CONTROL_EMBEDDED: 1,
			VIDEO_CONTROL_FULLSCREEN: 2,
			VIDEO_CONTROL_NONE: 0,
			VIDEO_CONTROL_HIDDEN: 0,

			VIDEO_SCALING_NONE: 0,
			VIDEO_SCALING_ASPECT_FILL: 2,
			VIDEO_SCALING_ASPECT_FIT: 1,
			VIDEO_SCALING_MODE_FILL: 3,

			VIDEO_PLAYBACK_STATE_STOPPED: 0,
			VIDEO_PLAYBACK_STATE_PLAYING: 1,
			VIDEO_PLAYBACK_STATE_PAUSED: 2,

			VIDEO_LOAD_STATE_PLAYABLE: 1,
			VIDEO_LOAD_STATE_PLAYTHROUGH_OK: 2,
			VIDEO_LOAD_STATE_STALLED: 4,
			VIDEO_LOAD_STATE_UNKNOWN: 0,

			VIDEO_REPEAT_MODE_NONE: 0,
			VIDEO_REPEAT_MODE_ONE: 1,

			VIDEO_FINISH_REASON_PLAYBACK_ENDED: 0,
			VIDEO_FINISH_REASON_PLAYBACK_ERROR: 1,
			VIDEO_FINISH_REASON_USER_EXITED: 2,

			MEDIA_TYPE_PHOTO: "public.image",
			MEDIA_TYPE_VIDEO: "public.video"
		},

		//beep: function() {},
		
		openPhotoGallery: function(args){
			var service = new tizen.ApplicationService('http://tizen.org/appcontrol/operation/pick', null,'IMAGE/*');			 
			var serviceReplyCB = {
			   // callee now sends a reply
				onsuccess: function(reply) {   // reply -> ApplicationServiceData[0]
					var path = reply[0].value.toString();
					var filename = path.substring(path.lastIndexOf('/')+1);
					function readFromStream(fileStream){
							var contents = fileStream.readBase64(fileStream.bytesAvailable);
							fileStream.close();
							
							var blob = new Blob({
								data: contents,
								length: contents.length,
								mimeType: 'image/jpeg'
						    });
							
							var event = {
								cropRect: null,
								media: blob,
								mediaType: Ti.Media.MEDIA_TYPE_PHOTO
							}
							args.success(event);
					};
					function successCB(dir) {
						var file = dir.resolve(filename);
						file.openStream(
							// open for reading
							'r',
							// success callback - read and display the contents of the file
							readFromStream,
							// error callback
							function(e) {console.log("Error with open stream" + e.message)}
						);	
					};
					tizen.filesystem.resolve(
						'images', 
						successCB, 
						function(e) { console.log("Error" + e.message);}, 
						"rw");
				},
			   // Something went wrong 
				onfail: args.error 
			}
			tizen.application.launchService(
				service,
				null,
				function() { console.log("Launch service succeeded"); }, 
				function(e) { console.log("Launch service failed. Reason : " + e.name); },  
				serviceReplyCB	
		   );
		},
		
		createAudioPlayer: function(args) {
			return new (require("Ti/Media/AudioPlayer"))(args);
		},

		createSound: function(args) {
			return new (require("Ti/Media/Sound"))(args);
		},

		createVideoPlayer: function(args) {
			return new (require("Ti/Media/VideoPlayer"))(args);
		},

		vibrate: function(pattern) {
			"vibrate" in navigator && navigator.vibrate(require.is(pattern, "Array") ? pattern : [pattern | 0]);
		}

	});
	
});