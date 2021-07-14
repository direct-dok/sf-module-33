import { getFromStorage, addToStorage } from "../utils";

export class Cabinet {

    constructor(userLogin, data) {
        this.userLogin = userLogin;
        this.data = data;
        this.storageKey = 'userCabinet'
    }


    static save(cabinet) {
        try {
            addToStorage(cabinet, cabinet.storageKey);
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

}