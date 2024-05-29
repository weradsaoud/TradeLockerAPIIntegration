import { AccountContract } from "../contracts/account-cotract";
import { AccountDetailsContract } from "../contracts/accountDeails_contract";

export class AccountDetailsModel{

    constructor(accountDetails: AccountDetailsContract) {
        this.name = accountDetails.name;
        this.type = accountDetails.type;
        this.currency = accountDetails.currency;
        this.status = accountDetails.status;
        this.support_Brackets = accountDetails.tradingRules.supportBrackets;
        this.support_Partial_Close_Position = accountDetails.tradingRules.supportPartialClosePosition;
        this.support_Self_Trading! = accountDetails.tradingRules.supportSelfTrading;
        this.support_Trading_Out_Of_TradingHours! = accountDetails.tradingRules.supportTradingOutOfTradingHours;
        this.max_Positions_Number = accountDetails.riskRules.maxPositionsNumber;
        this.max_Pending_Orders_Number = accountDetails.riskRules.maxPendingOrdersNumber;
        this.max_Orders_Count = accountDetails.riskRules.maxOrdersCount;
        
    }
    name!: string;
    type!: string;
    currency!: string;
    status!: string;
    support_Brackets!: boolean;
    support_TrailingStop!: boolean;
    support_Partial_Close_Position!: boolean;
    support_Self_Trading!: boolean;
    support_Trading_Out_Of_TradingHours!: boolean;
    max_Positions_Number!: number;
    max_Pending_Orders_Number!: number;
    max_Orders_Count!: number;
}