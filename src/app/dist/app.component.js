"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var forms_1 = require("@angular/forms");
var safe_pipe_1 = require("./safe.pipe");
var AppComponent = /** @class */ (function () {
    function AppComponent(service, safe) {
        this.service = service;
        this.safe = safe;
        this.title = 'carebot';
        this.convo = false;
        this.message = '';
        this.startNow = false;
        this.chatForm = new forms_1.FormGroup({});
        this.ignorePhrases = [
            'Hii', 'hii', 'hi', 'Hey', 'hey', 'Yo', 'yo', 'Mm', 'mm', 'Hmm', 'yeah', 'yup', 'okay', 'ok', 'bye'
        ];
        this.match = false;
        this.fillForm = false;
        this.chatBody = true;
        this.recordingStatus = false;
        this.replies = [
            "\n      <div class=\"row\">\n        <div class=\"talk-bubble tri-right left-top bg-success shadow-sm\">\n          <div class=\"talktext\">\n            <p>Tomodachi!!! Welcome :) How are you feeling today?</p>\n          </div>\n        </div>\n      </div>"
        ];
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.chatForm = new forms_1.FormGroup({
            'chat': new forms_1.FormControl(null, forms_1.Validators.required)
        });
        this.service.chatBodyDisplay.subscribe(function (num) {
            num == 1 ? _this.chatBody = true : _this.chatBody = false;
        });
        this.service.movieRecommendationData.subscribe(function (data) {
            var template = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var movie = data_1[_i];
                template.push("\n            <span class=\"p-2 bg-light text-success border border-default rounded shadow-sm\"> " + movie + " </span> <br>\n            ");
            }
            _this.replies.push("\n        <div class=\"row\">\n          <div class=\"talk-bubble tri-right left-top bg-success shadow-sm\">\n            <div class=\"talktext\">\n              <p>Try the following movies:</p> <br>\n              " + template.join('<br/>') + "\n            </div>\n          </div>\n        </div>");
        });
        setTimeout(function () {
            _this.service.locationRecommendation.subscribe(function (site) {
                var template = [];
                for (var p in site) {
                    var place = String(site[p]).split(" :");
                    if (place[1].includes("None")) {
                        template.push("\n                <span class=\"p-2 bg-light text-success border border-default rounded shadow-sm\"> " + place[0] + " </span> <br>\n                ");
                    }
                    else {
                        template.push("\n                <div class=\"p-2 bg-light text-success border border-default rounded shadow-sm\"> " + place[0] + " <br>\n                  <span class=\"text-small\"> There's more nearby!!</span> <br> " + place[1] + "\n                </div>\n                ");
                    }
                }
                _this.replies.push("\n          <div class=\"row\">\n            <div class=\"talk-bubble tri-right left-top bg-success shadow-sm\">\n              <div class=\"talktext\">\n                <p>Try the following places! </p> <br>\n                " + template.join('<br/>') + "\n              </div>\n            </div>\n          </div>");
            });
        }, 4000);
        setTimeout(function () {
            _this.startNow = true;
        }, 1500);
    };
    AppComponent.prototype.sendMessage = function () {
        var _this = this;
        var _a;
        this.message = (_a = this.chatForm.get('chat')) === null || _a === void 0 ? void 0 : _a.value;
        setTimeout(function () {
            _this.replies.push("<div class=\"row justify-content-end bg-white\">\n          <div class=\"talk-bubble tri-right btm-right shadow-sm\">\n            <div class=\"talktext\">\n              " + _this.message + "\n            </div>\n        </div>\n      </div>");
        }, 1000);
        var search = this.message.split(' ');
        for (var _i = 0, search_1 = search; _i < search_1.length; _i++) {
            var eachWord = search_1[_i];
            if (this.ignorePhrases.includes(eachWord.toLocaleLowerCase()) && search.length == 1) {
                this.match = true;
                break;
            }
        }
        if (!this.match) {
            this.service.getEmotion(this.message).subscribe(function (response) {
                _this.emotion = response.trim();
                _this.service.storeEmotion(_this.emotion);
                if (_this.emotion === 'Happy') {
                    _this.replies.push("\n            <div class=\"row\">\n              <div class=\"talk-bubble tri-right left-top bg-success shadow-sm\">\n                <div class=\"talktext\">\n                  <p>Oh Yay! Glad to hear that. Could you fill up the form for me please?</p>\n                </div>\n              </div>\n            </div>");
                }
                else {
                    _this.replies.push("\n            <div class=\"row\">\n              <div class=\"talk-bubble tri-right left-top bg-success shadow-sm\">\n                <div class=\"talktext\">\n                  <p>Oh! Let me help you with that. Could you fill up the form for me please?</p>\n                </div>\n              </div>\n            </div>");
                }
                _this.fillForm = true;
            });
        }
        this.emotion = localStorage.getItem('emotion');
        this.chatForm.reset();
        this.match = false;
    };
    AppComponent.prototype.showForm = function () {
        this.fillForm = false;
        this.service.storeEmotionSubject.next(this.emotion);
        this.chatBody = false;
    };
    AppComponent.prototype.formReject = function () {
        this.fillForm = false;
        this.replies.push("\n        <div class=\"row\">\n          <div class=\"talk-bubble tri-right left-top bg-success shadow-sm\">\n            <div class=\"talktext\">\n              <p>Let us talk after sometime alright? Hang in there.</p>\n            </div>\n          </div>\n    </div><hr>");
    };
    AppComponent.prototype.recordUserAudio = function () {
        this.recordingStatus = true;
    };
    AppComponent.prototype.stopRecording = function () {
        this.recordingStatus = false;
        this.replies.push("<div class=\"row justify-content-end bg-white\">\n        <div class=\"talk-bubble tri-right btm-right shadow-sm\">\n          <div class=\"talktext\">\n            <audio controls [src]=\"audioURL | safe\"></audio>\n          </div>\n      </div>\n    </div>");
    };
    AppComponent = __decorate([
        core_2.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css'],
            providers: [safe_pipe_1.SafePipe],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
