
var rules={'length': [{'id': 1, 'score': 25, 'associateFlag': '', 'regular': ['/^.{8,}$/']}, {'id': 2, 'score': 10, 'associateFlag': '', 'regular': ['/^.{5,7}$/']}, {'id': 3, 'score': 5, 'associateFlag': '', 'regular': ['/^.{1,4}$/']}], 'character': [{'id': 1, 'score': 20, 'associateFlag': '&&', 'regular': ['/[a-z]{1,}/', '/[A-Z]{1,}/']}, {'id': 2, 'score': 10, 'associateFlag': '||', 'regular': ['/[a-z]{1,}/', '/[A-Z]{1,}/']}, {'id': 3, 'score': 0, 'associateFlag': '', 'regular': ['/[^a-zA-Z]/']}], 'digit': [{'id': 1, 'score': 20, 'associateFlag': '', 'regular': ['/\\d{1}(.*?)\\d{1}(.*?)\\d{1}/']}, {'id': 2, 'score': 15, 'associateFlag': '', 'regular': ['/\\d{1}(.*?)\\d{1}/']}, {'id': 3, 'score': 10, 'associateFlag': '', 'regular': ['/[0-9]{1}/']}, {'id': 4, 'score': 0, 'associateFlag': '', 'regular': ['/[^0-9]/']}], 'symbol': [{'id': 1, 'score': 25, 'associateFlag': '', 'regular': ['/[^a-zA-Z0-9]{1}(.*?)[^a-zA-Z0-9]{1}/']}, {'id': 2, 'score': 10, 'associateFlag': '', 'regular': ['/[^a-zA-Z0-9]{1}/']}, {'id': 3, 'score': 0, 'associateFlag': '', 'regular': ['/[^a-zA-Z0-9$]/']}], 'defaultReward': [{'id': 1, 'score': 5, 'associateFlag': '&&', 'regular': ['/[a-z]{1,}/', '/[A-Z]{1,}/', '/[0-9]{1,}/', '/[^a-zA-Z0-9]{1,}/']}, {'id': 2, 'score': 3, 'associateFlag': '&&', 'regular': ['/[a-zA-Z]{1,}/', '/[0-9]{1,}/', '/[^a-zA-Z0-9]{1,}/']}, {'id': 3, 'score': 2, 'associateFlag': '&&', 'regular': ['/[a-zA-Z]{1,}/', '/[0-9]{1,}/']}]}


function calculatePasswordScore(password) {
      // var {rules} = JSON.parse(localStorage.getItem('password_score_rules'));
      var totalScore = 0;
      if (rules) {

          for (var i = 0; i < rules.length.length; i++) {
              if (rules.length[i].regular[0]) {
                  if (password.match(new RegExp(rules.length[i].regular[0].replace(/^\/|\/$/g,'')))) {
                      totalScore += rules.length[i].score;
                      break;
                  }
              }
          }
          var characterScore = 0;
          for (var i = 0; i < rules.character.length; i++) {
              var regexTwenty, regexTen
              if (rules.character[i].regular[0]) {
                regexTwenty =  new RegExp(rules.character[i].regular[0].replace(/^\/|\/$/g,''));
              }
              if (rules.character[i].regular[1]) {
                regexTen = new RegExp(rules.character[i].regular[1].replace(/^\/|\/$/g,''));
              }
            if (rules.character[i].associateFlag === "&&" && password.match(regexTwenty) && password.match(regexTen)) {
                characterScore = rules.character[i].score;
                break;
            }
            if (rules.character[i].associateFlag === "||" && (password.match(regexTwenty) || password.match(regexTen))) {
                characterScore = rules.character[i].score;
                break;
            }
          }
          totalScore += characterScore;
          for (var i = 0; i < rules.digit.length; i++) {
              if (rules.digit[i].regular[0]) {
                  if (password.match(new RegExp(rules.digit[i].regular[0].replace(/^\/|\/$/g,'')))) {
                      totalScore += rules.digit[i].score;
                      break;
                    }
                }
          }
          for (var i = 0; i < rules.symbol.length; i++) {
              if (rules.symbol[i].regular[0]) {
                  if (password.match(new RegExp(rules.symbol[i].regular[0].replace(/^\/|\/$/g,'')))) {
                      totalScore += rules.symbol[i].score;
                      break;
                    }
                }
          }
          var defaultRewardScore = 0;
          for (var i = 0; i < rules.defaultReward.length; i++) {
            var regexFive,
                regexThree,
                regexTwo,
                regexZero;
            if (rules.defaultReward[i].regular[0]) {
               regexFive = new RegExp(rules.defaultReward[i].regular[0].replace(/^\/|\/$/g,''));
            }
            if (rules.defaultReward[i].regular[1]) {
               regexThree = new RegExp(rules.defaultReward[i].regular[1].replace(/^\/|\/$/g,''));
            }
            if (rules.defaultReward[i].regular[2]) {
               regexTwo = new RegExp(rules.defaultReward[i].regular[2].replace(/^\/|\/$/g,''));
            }
            if (rules.defaultReward[i].regular[3]) {
               regexZero = new RegExp(rules.defaultReward[i].regular[3].replace(/^\/|\/$/g,''));
           }
                if (rules.defaultReward[i].associateFlag === "&&" &&
                password.match(regexFive) &&
                password.match(regexThree) &&
                password.match(regexTwo) &&
                password.match(regexZero)) {
                    defaultRewardScore = rules.defaultReward[i].score;
                    break;
                  }
            }
          totalScore += defaultRewardScore;
          return totalScore;
      }

  }


  console.log(calculatePasswordScore('123456'))