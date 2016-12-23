var app = angular.module('baseballApp', []);

app.controller('indexController', ['$scope', '$http', function IndexController($scope, $http) {
	 function groupGamesPerTeam(events, teams){
		 for(var i = 0; i < events.length; i++)
		 {
			var game = events[i].game;
			//Home team
			var homeTeam = _.findIndex(teams, {'guid': game.home_guid});
			//Away team
			var awayTeam = _.findIndex(teams, {'guid': game.visitor_guid});
			events[i].start_time = new Date(events[i].start_time);
			teams[homeTeam].games.push(events[i]);
			teams[awayTeam].games.push(events[i]);
		 }
		 return teams;
	 }
	 
	 function allTeams(divisions)
	 {
		 var teams = [];
		 for(var i = 0; i < divisions.length; i++)
		 {
			 for(var j = 0; j < divisions[i].teams.length; j++)
			 {
				divisions[i].teams[j].games = [];
				teams.push(divisions[i].teams[j]);
			 }
		 }
		 return teams;
	 }
	 
	 $http.get('JSON.json').success(function(data) {
		var league = data.league;
		var teams = allTeams(league.divisions);
		$scope.teams = groupGamesPerTeam(league.events, teams);
		$scope.divisions = league.divisions;
		
		$scope.selectedTeam = {};
		$scope.isTeamSelected = false;
		
		$scope.setTeamSchedule = function(teamId, divisionId)
		{
			var division = _.find(league.divisions, {'guid': divisionId});
			$scope.selectedTeam = _.find($scope.teams, {'guid': teamId});
			$scope.isTeamSelected = true;
		}
    });
}]);

app.directive('navBar', function(){
	return {
		templateUrl: '/templates/nav-bar.html'
	};
});

app.directive('gridSchedule', function(){
	return {
		templateUrl: '/templates/grid-schedule.html'
	};
});