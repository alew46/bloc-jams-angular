(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc in Fixtures, this just returns the albumPicasso object
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();

        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;

        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {    
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Plays buzz object of song and sets .playing to true
        * @param {Object} song
        */
        var playSong = function(song) {
            // play the current buzz object
            currentBuzzObject.play();
            
            // set song.playing to true
            song.playing = true;
        };
        
        /**
        * @function getSong
        * @desc Returns index of song passed in (need to pass in currentSong later, wherever this is getting called in service)
        * @param {Object} song
        */
        var getSong = function(song) {
            return currentAlbum.songs.indexOf(song);
        }
        
        var stopSong = function() {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        }

        
        /*
        */
        SongPlayer.volume = 20;
        
        /*
        */
        SongPlayer.setVolume = function(vol) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(vol);
            }
        };
        
        /**
        * @desc Boolean to determine if song playing & if its same as one being hovered or clicked
        * @type {Boolean}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @desc Current playback time of current song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /*
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        /**
        * @function SongPlayer.play
        * @desc Play passed-in song
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            }
        };

        /**
         * @function pause
         * @desc Pause current song
         * @param {Object} song
         */
         SongPlayer.pause = function(song) {
             song = song || SongPlayer.currentSong;
             currentBuzzObject.pause();
             song.playing = false;
         };
        
        /**
         * @function SongPlayer.previous
         * @desc Gets index of currentSong and iterates it down 1, then plays song at that new index
         * @param none
         */
        SongPlayer.previous = function() {
            var currentSongIndex = getSong(SongPlayer.currentSong)
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        }
        
        /**
         * @function SongPlayer.next
         * @desc Gets index of currentSong and iterates it up 1, then plays song at that new index
         * @param none
         */
        SongPlayer.next = function() {
            var currentSongIndex = getSong(SongPlayer.currentSong);
            currentSongIndex ++;
            
            if (currentSongIndex > currentAlbum.songs.length-1) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        }

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();