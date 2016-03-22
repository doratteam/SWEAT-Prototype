angular.module('starter.controllers', [])

.factory('Auth', function ($firebaseAuth) {
    var usersRef = new Firebase('https://sweat-fitness.firebaseio.com/users');
    return $firebaseAuth(usersRef);
})

.factory('Workouts', ['$firebaseArray', function($firebaseArray) {
    var workoutsRef = new Firebase('https://sweat-fitness.firebaseio.com/workouts');
    return $firebaseArray(workoutsRef);
}])


.controller('LoginCtrl', function($scope, $state, Auth) {
    $scope.data = {};

    $scope.loginEmail = function(){
        Auth.$authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password
        }).then(function(authData) {
            console.log('Authenticated successfully with payload: ', authData);
            $state.go('tab');
        }).catch(function(error) {
            console.log('Login failed with error: ', error);
        });
    };

    $scope.signupEmail = function() {
        Auth.$createUser({
            email: $scope.data.email,
            password: $scope.data.password,
            firstname: $scope.data.firstname,
            lastname: $scope.data.lastname
        }).then(function(userData) {
            console.log('Successfully created user with uid: ', userData);
            $scope.loginEmail();
        }).catch(function(error) {
            console.log('User creation failed with error: ', error);
        });
    };
    $scope.cancelSignup = function() {
        $ionicHistory.goBack();
    }
})

.controller('MatchCtrl', function($scope, $state, $ionicListDelegate, Workouts) {
    $scope.Workouts = Workouts;

    $scope.confirmedWorkouts = [0,1,2];
    $scope.receivedWorkouts = [0,1,2];
    $scope.sentWorkouts = [0,1,2];
    //TODO: load actual data from server
    $scope.doRefresh = function() {
        //TODO: send request to server, get result, reload workouts, stop spinning
        // just stop the ion-refresher from spinning for now
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.listCanSwipe = function() {
        $ionicListDelegate.canSwipeItems(true);
    }

    $scope.confirmWorkout = function(item) {
        //TODO: write this function
        console.log('confirm');
    }

    $scope.declineWorkout = function(item) {
        //TODO: write this function
        console.log('decline');
    }

    $scope.deleteWorkout = function(item) {
        //TODO: write this function
        console.log('delete');
    }
})

.controller('ScheduleCtrl', function($scope, $state, $ionicPopup, Auth, Workouts) {
    // local variables, functions
    var __makeDateTime = function(date, time) {
        // time in the day in seconds
        var hours = parseInt(time/3600);
        var mins = parseInt((time - hours*3600)/60);
        return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hours, 
                mins,
                0, 0);
    }
    var __now = new Date();

    $scope.data = {};
    $scope.data.selectedDate = __now;
    $scope.data.selectedDay = __now.getDay();
    $scope.data.startTimepickerObj = {
        inputEpochTime: (__now.getHours() + 1) * 60 * 60,  //Optional
        step: 15,  //Optional
        format: 12,  //Optional
        titleLabel: 'Start Time',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            if (val) {
                this.inputEpochTime = val;
                $scope.data.startTime = val;
                $scope.data.startDateTime = __makeDateTime($scope.data.selectedDate, $scope.data.startTime);
            }
        }
    };
    $scope.data.startTime = $scope.data.startTimepickerObj.inputEpochTime;
    $scope.data.startDateTime = __makeDateTime(__now, $scope.data.startTime);

    $scope.data.endTimepickerObj = {
        inputEpochTime: (__now.getHours() + 2) * 60 * 60,  //Optional
        step: 15,  //Optional
        format: 12,  //Optional
        titleLabel: 'Start Time',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            if (val) {
                this.inputEpochTime = val;
                $scope.data.endTime = val;
                $scope.data.endDateTime = __makeDateTime($scope.data.selectedDate, $scope.data.endTime);
            }
        }
    };
    $scope.data.endTime = $scope.data.endTimepickerObj.inputEpochTime;
    $scope.data.endDateTime = __makeDateTime(__now, $scope.data.endTime);

    $scope.createWorkout = function() {
        Workouts.$add({
            workout_type: $scope.data.workout_type,
            location: $scope.data.location,
            lookingfor: $scope.data.lookingfor,
            startDateTime: $scope.data.startDateTime.toJSON(),
            endDateTime: $scope.data.endDateTime.toJSON(),
            onwerUid: Auth.$getAuth().uid,
            matched: false,
            confirmed: false
        });
    };

    $scope.setDay = function(day) {
        $scope.data.selectedDay = day;
        var dateDiff = day - __now.getDay();
        dateDiff = (dateDiff < 0) ? dateDiff + 7 : dateDiff;
        $scope.data.selectedDate = new Date(__now.getTime() + dateDiff*24*60*60*1000);
        $scope.data.startDateTime = __makeDateTime($scope.data.selectedDate, $scope.data.startTime);
        $scope.data.endDateTime = __makeDateTime($scope.data.selectedDate, $scope.data.endTime);
    }
})
