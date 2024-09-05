import { ActorId, TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';

export type SubmissionStatus = "submitted" | "approved" | "rejected" | "noDecision";

export interface UserInput {
  login_method: LoginMethod;
  deadline: number;
  title: string;
  description: string;
  submission_requirements: string;
  submission_type: SubmissionType;
  reward_amount: number | string | bigint;
}

export type LoginMethod = "web3" | "email" | "username";

export type SubmissionType = "text" | "link";

export interface InformationQuest {
  login_method: LoginMethod;
  publisher_id: ActorId;
  deadline: number;
  title: string;
  description: string;
  submission_requirements: string;
  submission_type: SubmissionType;
  reward_amount: number | string | bigint;
  submissions: Submissions;
  quest_status: QuestStatus;
}

export interface Submissions {
  map: Record<ActorId, string>;
  status: Record<ActorId, SubmissionStatus>;
}

export type QuestStatus = "open" | "completed" | "closed";

export interface CompactQuestInfo {
  title: string;
  description: string;
  deadline: number;
  quest_status: QuestStatus;
  submission_count: number;
  decision_count: number;
}

export class Program {
  public readonly registry: TypeRegistry;
  public readonly infoQuestSvc: InfoQuestSvc;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      SubmissionStatus: {"_enum":["Submitted","Approved","Rejected","NoDecision"]},
      UserInput: {"login_method":"LoginMethod","deadline":"u32","title":"String","description":"String","submission_requirements":"String","submission_type":"SubmissionType","reward_amount":"u128"},
      LoginMethod: {"_enum":["Web3","Email","Username"]},
      SubmissionType: {"_enum":["Text","Link"]},
      InformationQuest: {"login_method":"LoginMethod","publisher_id":"[u8;32]","deadline":"u32","title":"String","description":"String","submission_requirements":"String","submission_type":"SubmissionType","reward_amount":"u128","submissions":"Submissions","quest_status":"QuestStatus"},
      Submissions: {"map":"BTreeMap<[u8;32], String>","status":"BTreeMap<[u8;32], SubmissionStatus>"},
      QuestStatus: {"_enum":["Open","Completed","Closed"]},
      CompactQuestInfo: {"title":"String","description":"String","deadline":"u32","quest_status":"QuestStatus","submission_count":"u32","decision_count":"u32"},
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);

    this.infoQuestSvc = new InfoQuestSvc(this);
  }

  newCtorFromCode(code: Uint8Array | Buffer): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      'New',
      'String',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      'New',
      'String',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }
}

export class InfoQuestSvc {
  constructor(private _program: Program) {}

  public close(title: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['InfoQuestSvc', 'Close', title],
      '(String, String, String)',
      'Null',
      this._program.programId
    );
  }

  public decide(participant: ActorId, decision: SubmissionStatus, title: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['InfoQuestSvc', 'Decide', participant, decision, title],
      '(String, String, [u8;32], SubmissionStatus, String)',
      'Null',
      this._program.programId
    );
  }

  public publish(quest_details: UserInput): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['InfoQuestSvc', 'Publish', quest_details],
      '(String, String, UserInput)',
      'Null',
      this._program.programId
    );
  }

  public submit(submission: string, title: string): TransactionBuilder<null> {
    if (!this._program.programId) throw new Error('Program ID is not set');
    return new TransactionBuilder<null>(
      this._program.api,
      this._program.registry,
      'send_message',
      ['InfoQuestSvc', 'Submit', submission, title],
      '(String, String, String, String)',
      'Null',
      this._program.programId
    );
  }

  public async getAllQuests(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Record<string, InformationQuest> | null> {
    const payload = this._program.registry.createType('(String, String)', ['InfoQuestSvc', 'GetAllQuests']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<BTreeMap<String, InformationQuest>>)', reply.payload);
    return result[2].toJSON() as unknown as Record<string, InformationQuest> | null;
  }

  public async getCompactQuestsInfo(originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Array<CompactQuestInfo> | null> {
    const payload = this._program.registry.createType('(String, String)', ['InfoQuestSvc', 'GetCompactQuestsInfo']).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<Vec<CompactQuestInfo>>)', reply.payload);
    return result[2].toJSON() as unknown as Array<CompactQuestInfo> | null;
  }

  public async getQuest(title: string, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<InformationQuest | null> {
    const payload = this._program.registry.createType('(String, String, String)', ['InfoQuestSvc', 'GetQuest', title]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<InformationQuest>)', reply.payload);
    return result[2].toJSON() as unknown as InformationQuest | null;
  }

  public async getSubmissions(title: string, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<Submissions | null> {
    const payload = this._program.registry.createType('(String, String, String)', ['InfoQuestSvc', 'GetSubmissions', title]).toHex();
    const reply = await this._program.api.message.calculateReply({
      destination: this._program.programId,
      origin: originAddress ? decodeAddress(originAddress) : ZERO_ADDRESS,
      payload,
      value: value || 0,
      gasLimit: this._program.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    if (!reply.code.isSuccess) throw new Error(this._program.registry.createType('String', reply.payload).toString());
    const result = this._program.registry.createType('(String, String, Option<Submissions>)', reply.payload);
    return result[2].toJSON() as unknown as Submissions | null;
  }

  public subscribeToPublishedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'Published') {
        callback(null);
      }
    });
  }

  public subscribeToSubmittedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'Submitted') {
        callback(null);
      }
    });
  }

  public subscribeToDecisionMadeEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'DecisionMade') {
        callback(null);
      }
    });
  }

  public subscribeToClosedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'Closed') {
        callback(null);
      }
    });
  }

  public subscribeToSubmissionNotFoundEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'SubmissionNotFound') {
        callback(null);
      }
    });
  }

  public subscribeToQuestIsClosedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'QuestIsClosed') {
        callback(null);
      }
    });
  }

  public subscribeToQuestDoesNotExistEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'QuestDoesNotExist') {
        callback(null);
      }
    });
  }

  public subscribeToAlreadyDecidedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'AlreadyDecided') {
        callback(null);
      }
    });
  }

  public subscribeToQuestCompletedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'QuestCompleted') {
        callback(null);
      }
    });
  }

  public subscribeToSubmissionRejectedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'SubmissionRejected') {
        callback(null);
      }
    });
  }

  public subscribeToAlreadySubmittedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'AlreadySubmitted') {
        callback(null);
      }
    });
  }

  public subscribeToPermissionDeniedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'PermissionDenied') {
        callback(null);
      }
    });
  }

  public subscribeToRequireCommitmentEvent(callback: (data: [number | string | bigint, number | string | bigint]) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'RequireCommitment') {
        callback(this._program.registry.createType('(String, String, (u128, u128))', message.payload)[2].toJSON() as unknown as [number | string | bigint, number | string | bigint]);
      }
    });
  }

  public subscribeToDeadlinePassedEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'DeadlinePassed') {
        callback(null);
      }
    });
  }

  public subscribeToTitleAlreadyExistsEvent(callback: (data: null) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'TitleAlreadyExists') {
        callback(null);
      }
    });
  }

  public subscribeToIllegalTitleEvent(callback: (data: string) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'IllegalTitle') {
        callback(this._program.registry.createType('(String, String, String)', message.payload)[2].toString() as unknown as string);
      }
    });
  }

  public subscribeToIllegalDescriptionEvent(callback: (data: string) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'IllegalDescription') {
        callback(this._program.registry.createType('(String, String, String)', message.payload)[2].toString() as unknown as string);
      }
    });
  }

  public subscribeToIllegalRequirementsEvent(callback: (data: string) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'IllegalRequirements') {
        callback(this._program.registry.createType('(String, String, String)', message.payload)[2].toString() as unknown as string);
      }
    });
  }
}