import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ChatDialogComponent} from "./chat-dialog/chat-dialog.component";
import {Draggable} from "ng2draggable/draggable.directive";
import {ChatService} from "app/chat/services/chat.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MomentModule} from "angular2-moment";
import {SoundService} from "app/chat/services/sound.service";
import {ScrollChatDirective} from "./scroll-chat.directive";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    TranslateModule
  ],
  exports: [
    ChatDialogComponent
  ],
  declarations: [
    Draggable,
    ChatDialogComponent,
    ScrollChatDirective
  ],
  providers: [
    ChatService,
    SoundService
  ]
})

export class ChatModule {
}
