angular.module('myApp.config', [])

    .value('API', 'http://localhost:3001')
    .value('Link', 'http://localhost:3001/#!')
    .value('Socket', 'http://localhost:4200')
    .value('Time', {
        'time_interview': 15*60000,
        'second': "Sec",
        'minut': "Min",
        'sec': 1000,
        'min': 60000
    })