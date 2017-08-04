var pallete1 = ['#9F0F18', '#00A64B', '#CDA609', '#094A8E'];
var pallete2 = ['#ff3333', '#00FF7F', '#ffff66', '#7B68EE'];
var sequence = [];
var checking = [];
var buttons = [];
var audios = [];
var buttonFlashTimeouts = [];
var countTextTimeout = [];
var gameTout;
var gameState;
var count = 1;
 var btnClick = function (audios) {
        var checkClick = arguments[1];
        if (this.dataset.clickable === 'true') {
            if (this.dataset.number == checking.shift() || checkClick == 1) {
            audios[this.dataset.number].play();
            this.style['background-color'] = buttons[this.dataset.number].click_fill;
            (function (that) {
            setTimeout(function () {
            that.style['background-color'] = buttons[that.dataset.number].initial_fill;
            }, 300);
            })(this);
            clearTimeout(gameTout);
            if (checking.length !== 0) { // sequence is still left.
                gameTout = setTimeout(function () {
                audios[4].play();
                startAgain();
                }, 5000);
                } else { // sequence completed
                if (document.getElementById('count_disp').value === ' 20') { // user wins when completed level 20.
                stopGame(buttons);
                setTimeout(function () {
                alert('Congo!!! You Have Won....Press Start to play again');
                gameState = 0;
                }, 600);
                } else {
                buttons.forEach(function (button) {
                    button.element.dataset.clickable = false; // setting the clickable attribute of the buttons to false during the next sequence.
                    });
                    startGame(audios); // start new level of n buttons with the first (n-1) buttons similar to last sequence.
                }
            }
            } else {
                audios[4].play();
                startAgain(buttons); // shows error and starts again in the same level(non-strict) or 1st level(strict).
            }
        }
    };
    function Button (element, number) {
    this.element = element;
    this.initial_fill = pallete1[number];
    this.click_fill = pallete2[number];
    }

    for (var i = 0; i < 4; i++) {
    audios[i] = document.getElementById('audio' + i);
    buttons[i] = new Button(document.getElementById('button' + i), i);
    }
    audios[4] = document.getElementById('audio4');

    function startAgain (buttons) { // called when the user does any error or when the timeout finishes
            var allDisabled = false;
            var testWhenStrict = arguments[1];
            buttons.forEach(function (button) {
                            button.element.dataset.clickable = false; // user cannot click the buttons when the sequence is flashing
                            allDisabled = !(allDisabled || button.element.dataset.clickable == 'false');
                            });
            clearTimeout(gameTout);
            count--;
            document.getElementById('count_disp').value = ' ! !';
            setTimeout(function () {
            document.getElementById('count_disp').style.color = 'brown';
            }, 100);
            setTimeout(function () {
            document.getElementById('count_disp').style.color = 'red';
            }, 400);
            setTimeout(function () {
            document.getElementById('count_disp').style.color = 'brown';
            }, 700);
            setTimeout(function () {
            document.getElementById('count_disp').style.color = 'red';
            }, 1000);
            if (document.getElementById('strict').dataset.mode == '1' || testWhenStrict == 1) { // when in strict mode,reset the initial sequence and the timeout 
                setTimeout(function () {
                stopGame(buttons);
                document.getElementById('strict_indicator').style['background-color'] = 'red';
                document.getElementById('strict').dataset.mode = 1;
                }, 1200);
                document.getElementById('count_disp').style.color = 'red';
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'brown';
                }, 1300);
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'red';
                }, 1700);
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'brown';
                }, 2100);
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'red';
                }, 2500);
                setTimeout(function () {
                startGame(audios);
                }, 2700);
            } else {
                setTimeout(function () {
                startGame(audios); // in non-strict mode,carry on the game with the recent sequence
                }, 1200);
            }
            return {
                  'clickable': !allDisabled,
                  'display': document.getElementById('count_disp').value,
                  'display-color': document.getElementById('count_disp').style.color
            };
    }

    function startGame (audios, buttons) { // gets executed for every new sequence
        var rBtnNum, // stores the random button number generated 
        checkForAudio = arguments[2],
        audioPlays;
        for (var i = 0; i < count; i++) {
        if (sequence[i] == null) { // empty value at that index
            rBtnNum = Math.floor(Math.random() * 4);
            sequence.push(rBtnNum);
        } else { // contains value from the previous sequence
            rBtnNum = sequence[i];
        }
        (function (j, k, timeouts, checkForAudio, audioPlays) {
            buttonFlashTimeouts[k] = setTimeout(function () {
            if (document.getElementById('toggle_btn').dataset.mode == 1 || checkForAudio == 1) {
              try {
                audios[j].play();
                audioPlays = true;
               } catch (e) {
                 audioPlays = false;
               }
              document.getElementById('count_disp').value = count > 9 ? ' ' + count : ' 0' + count;
              if (k === (count - 1)) {
                var index = 0;
                buttons.forEach(function (button) { // setting clickable attribute of the button to true after the flashes.
                button.element.dataset.clickable = true;
                });
                count++;
                sequence.forEach(function (elem) {
                checking[index++] = elem;
                });
                gameTout = setTimeout(function () { // creating timeout for a sequence.gets reseted after each correct click.
                audios[4].play();
                startAgain(buttons);
                }, 5000);
            }
            buttons[j].element.style['background-color'] = buttons[j].click_fill;
            setTimeout(function () {
            buttons[j].element.style['background-color'] = buttons[j].initial_fill;
            }, 600);
            }
            }, 1400 + 1500 * k); // 1200ms for the count display flash,200ms wait time after the buttons start flashing,   
                        // 1500*k is the wait time for button in the sequence after which it flashes for 600ms(k=0 to 3).
        })(rBtnNum, i, buttonFlashTimeouts, checkForAudio, audioPlays);
      }
      return {
             'sequence': sequence,
             'toggle_btn_mode': document.getElementById('toggle_btn').dataset.mode,
             'audios': audios,
             'count': count,
             'audioPlays': audioPlays
             };
    }

    function stopGame (buttons) { // called when the game finishes or the user stops the game from the stop button
        document.getElementById('count_disp').value = ' - -';
        document.getElementById('count_disp').style.color = 'brown';
        sequence = [];
        checking = [];
        count = 1;
        clearTimeout(gameTout);
        buttons.forEach(function (button) {
                        button.element.dataset.clickable = false;
                    });
        buttonFlashTimeouts.forEach(function (timeout) {
        clearTimeout(timeout);
        });
        document.getElementById('strict_indicator').style['background-color'] = 'black';
        document.getElementById('strict').dataset.mode = 0;

        return {
            display: document.getElementById('count_disp').value,
            color: document.getElementById('count_disp').style.color,
            count: count
        };
    }
  var eventForToggleBtn = function () { // toggles ON/OFF button
            if (document.getElementById('toggle_btn').dataset.mode === '0') {
                document.getElementById('toggle_btn').style.float = 'right';
                document.getElementById('toggle_btn').dataset.mode = 1;
                document.getElementById('count_disp').style.color = 'red';
            } else {
                document.getElementById('toggle_btn').style.float = 'left';
                document.getElementById('toggle_btn').dataset.mode = 0;
                for (var i = 0; i < 4; i++) {
                 buttons[i].element = document.getElementById('button' + i);
                }
                stopGame(buttons);
            }
    };

 var eventForStartBtn = function (gameState) { // executed when the user clicks the start button and the game starts. 
        if (!gameState) { // checks if the start button is clicked between gameplay 
            gameState = 1;
            buttonFlashTimeouts.forEach(function (item) {
                clearTimeout(item);
            });
            if (document.getElementById('toggle_btn').dataset.mode == 1) { // execute only if the button start button is set to ON.
                document.getElementById('count_disp').style.color = 'red';
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'brown';
                }, 100);
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'red';
                }, 400);
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'brown';
                }, 700);
                setTimeout(function () {
                document.getElementById('count_disp').style.color = 'red';
                }, 1000);
                setTimeout(function () {
                startGame();
                }, 1200);
            }
        } else { // start button is pressed one or more times between game play  
            if (document.getElementById('toggle_btn').dataset.mode == 1) {
                buttonFlashTimeouts.forEach(function (item) { // clears initial timeouts of the button flashes
                clearTimeout(item);
                });
                countTextTimeout.forEach(function (item) { // clears initial timeouts of the count text flashes
                clearTimeout(item);
                });
                for (var i = 0; i < 4; i++) {
                 buttons[i].element = document.getElementById('button' + i);
                }
                stopGame(buttons);
                countTextTimeout[0] = setTimeout(function () {
                document.getElementById('count_disp').style.color = 'brown';
                }, 100);
                countTextTimeout[1] = setTimeout(function () {
                document.getElementById('count_disp').style.color = 'red';
                }, 400);
                countTextTimeout[2] = setTimeout(function () {
                document.getElementById('count_disp').style.color = 'brown';
                }, 700);
                countTextTimeout[3] = setTimeout(function () {
                document.getElementById('count_disp').style.color = 'red';
                }, 1000);
                countTextTimeout[4] = setTimeout(function () {
                startGame();
                }, 1200);
            }
        }
    };

  var eventForStrictBtn = function () { // toggles the strict mode.
        if (document.getElementById('toggle_btn').dataset.mode == 1) {
            if (document.getElementById('strict').dataset.mode === '0') {
                document.getElementById('strict_indicator').style['background-color'] = 'red';
                document.getElementById('strict').dataset.mode = 1;
            } else {
                document.getElementById('strict_indicator').style['background-color'] = 'black';
                document.getElementById('strict').dataset.mode = 0;
            }
        }
    };
function attachUIEvents () {
    document.getElementById('toggle_bg').addEventListener('click', eventForToggleBtn);
    document.getElementById('start').addEventListener('click', eventForStartBtn);
    document.getElementById('strict').addEventListener('click', eventForStrictBtn);
    for (var i = 0; i < 4; i++) {
      document.getElementById('button' + i).addEventListener('click', btnClick);
    }
}
