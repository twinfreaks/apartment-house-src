import {
  Component, OnInit, ElementRef, ViewChild,
  ChangeDetectorRef, AfterViewChecked, OnDestroy
} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ChatService} from "app/chat/services/chat.service";
import {ReplaySubject} from "rxjs";
import {List} from "immutable";
import {SocketItem} from "app/chat/socket-item.model";
import {SoundService} from "app/chat/services/sound.service";
import {AuthAppService} from "app/auth/services/auth-app.service";
import * as _ from "lodash";
import {ToastrService} from "ngx-toastr";
import {ToastConfig} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {AppConfig} from "app/app.config";
import {trigger, state, style, transition, animate} from "@angular/animations";

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss'],
  animations: [
    trigger('windowVisibility', [
      state('true', style({opacity: 1.0, height: '*'})),
      state('false', style({opacity: 0, height: '0px'})),
      transition('true => false', animate('0.4s ease-out')),
      transition('false => true', animate('0.2s ease-in')),
    ]),
    trigger('chatVisibility', [
      state('true', style({opacity: 1.0, height: '*'})),
      state('false', style({opacity: 0, height: '0px'})),
      transition('true => false', animate('0.4s ease-out')),
      transition('false => true', animate('0.2s ease-in')),
    ]),
    trigger('buttonVisibility', [
      state('true', style({opacity: 0, height: '0px'})),
      state('false', style({opacity: 1.0, height: '*'})),
      transition('true => false', animate('0.4s ease-in')),
      transition('false => true', animate('0.2s ease-out')),
    ])
  ]
})
export class ChatDialogComponent implements OnInit, AfterViewChecked, OnDestroy {

  bubbleConfig: ToastConfig = {
    timeOut: 3000,
    positionClass: 'toast-bottom-left',
    closeButton: true
  };
  @ViewChild('scroll') private scrollContainer: ElementRef;
  private messageList: List<any> = List();
  messages: ReplaySubject<any> = new ReplaySubject();
  inhabitantId: any;
  connectionState: boolean;
  chatForm: FormGroup;
  //Chat controls
  showFullWindow: boolean;
  showWindow: boolean;
  showWindowAnimation: string;
  showFullWindowAnimation: string;
  isSound: boolean = true;
  firstMessageDate: string;
  isLoadingLazy: boolean = false;
  isLoadingEnd: boolean = false;
  isEmptyChat: boolean = true;
  canScrollDown: boolean = false;
  isInitialToBottom: boolean = false;
  isNewMessagesUnread: boolean = false;
  unreadedMessages: number = 0;
  defaultPageTitle: string;
  pageTitleNewMessage: string;
  pageTitleNewMessageNative: string;
  dynamicTitleIntervalId: Array<any> = [];
  imgProfilePath: string;
  windowWidth: number;
  isDraggable: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private chatService: ChatService,
              private sound: SoundService,
              private authApp: AuthAppService,
              private changeDetectorRef: ChangeDetectorRef,
              private toastr: ToastrService,
              private translate: TranslateService,
              private titleService: Title,
              private config: AppConfig) {
  }

  ngOnInit() {
    this.imgProfilePath = this.config.getConfig("api") + "/userProfile/";
    this.windowWidth = window.screen.width;

    if (this.windowWidth < 768) {
      this.isDraggable = false;
    }

    this.chatService.connectionState
        .subscribe(
            (state) => {
              this.connectionState = state
            }
        );
    this.chatService.connectionError
        .subscribe(
            (errorBody) => {
              this.toastr.error(errorBody.toString(), this.translate.instant("ERROR_OCCURED"));
            }
        );
    this.defaultPageTitle = this.titleService.getTitle();
    this.inhabitantId = this.authApp.getInhabitantId();
    this.showFullWindow = true;
    this.showWindow = true;
    this.showWindowAnimation = "false";
    this.showFullWindowAnimation = "false";

    this.getMessages();

    this.chatForm = this.formBuilder.group({
      "message": [null, Validators.required]
    });
  }

  ngAfterViewChecked() {
    if (this.canScrollDown === true) {
      this.scrollToBottom();
      this.canScrollDown = false;
    }
    if (this.isInitialToBottom === true) {
      this.addScrollFromTop(1);
      this.scrollToBottom();
      this.isInitialToBottom = false;
    }
  }

  ngOnDestroy() {
    this.restoreDefaultTitle();
  }

  minimizeChat() {
    this.showFullWindow = false;
    this.showWindow = true;
    this.showWindowAnimation = "true";
    this.showFullWindowAnimation = "false";
  }

  maximizeChat() {
    this.showFullWindow = true;
    this.showWindow = true;
    this.showWindowAnimation = "true";
    this.showFullWindowAnimation = "true";
  }

  closeChat() {
    this.showFullWindow = false;
    this.showWindow = false;
    this.showWindowAnimation = "false";
    this.showFullWindowAnimation = "false";
  }

  openChat() {
    this.showFullWindow = true;
    this.showWindow = true;
    this.showWindowAnimation = "true";
    this.showFullWindowAnimation = "true";
  }

  isSoundToogle() {
    this.isSound = !this.isSound;
  }

  getMessages() {
    this.chatService.getPrevious()
        .subscribe(
            (messages) => {
              let messagesLength = messages["data"].length;
              _.forEach(messages["data"], (message) => {
                this.messageList = this.messageList.unshift(message);
                this.firstMessageDate = messages["data"][messagesLength - 1].messageTime;
                if (message.messageReaded === false && message.sender.id !== this.inhabitantId) {
                  this.unreadedMessages++;
                  this.newMessageChangeTitle();
                }
              });

              if (messagesLength > 0) {
                this.isEmptyChat = false;
              }

              this.messages.next(this.messageList);
            },
            (err) => {
              this.toastr.error(err.toString(), this.translate.instant("ERROR_OCCURED"));
            },
            () => {
              this.isInitialToBottom = true;
              this.getMessageFlow();
            }
        );
  }

  getMessagesLazy(firstMessageDate) {
    this.isLoadingLazy = true;

    this.chatService.getLazy(firstMessageDate)
        .subscribe(
            (messages) => {
              let i = 0;
              _.forEach(messages["data"], (message) => {
                this.messageList = this.messageList.unshift(message);
                i++;

                if (i === messages["data"].length) {
                  this.firstMessageDate = message.messageTime;
                }
              });
              this.messages.next(this.messageList);
              this.isLoadingEnd = messages["isEnd"];
            },
            (err) => {
              this.toastr.error(err.toString(), this.translate.instant("ERROR_OCCURED"));
            },
            () => {
              this.isLoadingLazy = false;
              this.addScrollFromTop(1);
            }
        )
  }

  getMessageFlow() {
    this.chatService.getFlow()
        .subscribe(
            (socketItem: SocketItem) => {

              switch (socketItem.action) {
                case "create":
                  let message = socketItem.item;
                  let index: number = this.findIndex(message.id);

                  if (index === -1) {
                    this.messageList = this.messageList.push(message);
                  }
                  else {
                    this.messageList = this.messageList.set(index, message);
                  }

                  this.messages.next(this.messageList);

                  if (this.isSound && (message.sender.id !== this.inhabitantId)) {
                    this.sound.playSound("assets/sounds/msg.mp3");
                    this.createMessageBubble(message);
                    this.scrollOnNewMessage();
                    this.unreadedMessages++;
                    this.newMessageChangeTitle();
                  }

                  if (message.sender.id === this.inhabitantId) {
                    this.canScrollDown = true;
                  }

                  if (this.isScrolledFromBottom() && (message.sender.id !== this.inhabitantId)) {
                    this.isNewMessagesUnread = true;
                  }
                  break;

                case "update":
                  let messages = socketItem.item;

                  if (Array.isArray(messages)) {
                    _.forEach(messages, (message) => {
                      let index: number = this.findIndex(message.id);
                      this.messageList = this.messageList.update(index, (item) => {
                        item.messageReaded = true;
                        return item;
                      });
                    });
                    this.messages.next(this.messageList);
                  }
                  break;
              }
            },
            (error) => {
              this.toastr.error(error.toString(), this.translate.instant("ERROR_OCCURED"));
            }
        );
  }

  sendMessage() {
    const chatMessage = this.chatForm.value;
    chatMessage.sender = this.inhabitantId;
    this.chatService.create(this.chatForm.value);
    this.isNewMessagesUnread = false;
    this.chatForm.controls["message"].setValue(null);
    this.chatForm.controls["message"].updateValueAndValidity();
  }

  isScrolledUpHandler(state) {
    if (state === true && this.isLoadingLazy === false && this.isLoadingEnd === false) {
      this.getMessagesLazy(this.firstMessageDate);
    }
  }

  setReaded() {
    this.unreadedMessages = 0;
    this.chatService.setReaded(this.inhabitantId);
    this.restoreDefaultTitle();
  }

  goToBottom() {
    this.scrollToBottom();
    this.isNewMessagesUnread = false;
  }

  restoreDefaultTitle() {
    _.forEach(this.dynamicTitleIntervalId, (intervalId) => {
      clearInterval(intervalId);
    });
    this.titleService.setTitle(this.defaultPageTitle);
  }

  newMessageChangeTitle() {
    this.pageTitleNewMessage = "(" + this.unreadedMessages + ") " + this.translate.instant("NEW_MESSAGE");
    this.pageTitleNewMessageNative = "(" + this.unreadedMessages + ") " + this.defaultPageTitle;

    let titleType = false;
    let intervalId = setInterval(() => {
      titleType = !titleType;
      if (titleType === true) {
        this.titleService.setTitle(this.pageTitleNewMessage);
      }
      else {
        this.titleService.setTitle(this.pageTitleNewMessageNative);
      }
    }, 1700);
    this.dynamicTitleIntervalId.push(intervalId);
  }

  private createMessageBubble(message: Object) {
    if (!this.showWindow || !this.showFullWindow) {
      this.toastr.info(message["messageBody"], this.translate.instant("NEW_MESSAGE"), this.bubbleConfig);
    }
  }

  private addScrollFromTop(fromTop): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = fromTop;
      this.changeDetectorRef.detectChanges();
    }
    catch (err) {
    }
  }

  private scrollOnNewMessage(): void {
    if (!this.isScrolledFromBottom()) {
      this.canScrollDown = true;
    }
  }

  private isScrolledFromBottom(): boolean {
    let differenceScroll = this.scrollContainer.nativeElement.scrollHeight - this.scrollContainer.nativeElement.scrollTop;
    return differenceScroll > 350;
  }

  private scrollToBottom(): void {
    let scrollContainerEl = this.scrollContainer.nativeElement;
    try {
      let step = Math.ceil((this.scrollContainer.nativeElement.scrollHeight - this.scrollContainer.nativeElement.scrollTop) / 10);
      (function loop(i: number, prop: any): void {
        setTimeout(function main() {
          scrollContainerEl[prop] += step;
          i > 1 && loop(i - 1, prop);
        }, 50);
      }(10, 'scrollTop'));
    }
    catch (err) {
    }
  }

  private findIndex(messageId: string): number {
    return this.messageList.findIndex((msg) => {
      return msg.id === messageId;
    });
  }
}
