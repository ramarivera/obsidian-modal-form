import { AbstractInputSuggest, App } from "obsidian";
import {
    DataviewQueryFormValues,
    SafeDataviewQuery,
    executeSandboxedDvQuery,
    sandboxedDvQuery,
} from "./SafeDataviewQuery";
import { createRegexFromInput } from "./createRegexFromInput";
import { Option } from "@std";
import { FieldValue } from "src/store/formStore";

/**
 * Offers suggestions based on a dataview query.
 * It requires the dataview plugin to be installed and enabled.
 * For now, we are not very strict with the checks and just throw errors
 */
export class DataviewSuggest extends AbstractInputSuggest<string> {
    sandboxedQuery: SafeDataviewQuery;
    formValues: DataviewQueryFormValues = {};

    constructor(
        public inputEl: HTMLInputElement,
        dvQuery: string,
        public app: App,
    ) {
        super(app, inputEl);
        this.sandboxedQuery = sandboxedDvQuery(dvQuery);
    }

    getSuggestions(inputStr: string): string[] {
        const result = executeSandboxedDvQuery(this.sandboxedQuery, this.app, this.formValues);
        if (!inputStr) {
            return result;
        }
        const regex = createRegexFromInput(inputStr);
        return result.filter((r) => regex.test(r));
    }

    renderSuggestion(option: string, el: HTMLElement): void {
        el.setText(option);
    }

    selectSuggestion(option: string): void {
        this.inputEl.value = option;
        this.inputEl.trigger("input");
        this.close();
    }

    setCurrentFormValues(formValues: DataviewQueryFormValues): void {
        this.formValues = formValues;
    }
}
