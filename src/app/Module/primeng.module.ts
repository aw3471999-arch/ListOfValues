import { NgModule } from '@angular/core';

// PrimeNG UI Components
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { KnobModule } from 'primeng/knob';
import { ToolbarModule } from 'primeng/toolbar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';

const primengModules = [
    CommonModule,
    TableModule,
    CardModule,
    TagModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    SelectButton,
    KnobModule,
    ToolbarModule,
    ScrollPanelModule,
    AvatarModule,
    TabsModule,
    IconField,
    InputTextModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    PasswordModule


];
@NgModule({
    imports: [CommonModule, ...primengModules],
    exports: [...primengModules]
})
export class PrimengModule { }