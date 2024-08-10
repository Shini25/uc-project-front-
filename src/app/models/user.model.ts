export class User_account {
    matricule: string;
    password: string;
    email: string;
    verificationCode: string;
    accountStatus: string;
    accountType: string;
    accountState: string;

    constructor(
        matricule: string,
        password: string,
        email: string,
        verificationCode: string,
        accountStatus: string,
        accountType: string,
        accountState: string
    ) {
        this.matricule = matricule;
        this.password = password;
        this.email = email;
        this.verificationCode = verificationCode;
        this.accountStatus = accountStatus;
        this.accountType = accountType;
        this.accountState = accountState;
    }
}