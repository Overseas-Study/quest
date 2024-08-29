import { ActorId, TransactionBuilder, getServiceNamePrefix, getFnNamePrefix, ZERO_ADDRESS } from 'sails-js';
import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';

export interface UserInput {
  login_method: string;
  deadline: string;
  title: string;
  description: string;
  submission_requirements: string;
  submission_type: string;
  reward_amount: string;
}

export interface InformationQuest {
  login_method: string;
  deadline: string;
  title: string;
  description: string;
  submission_requirements: string;
  submission_type: string;
  reward_amount: string;
  submissions: Submissions;
}

export interface Submissions {
  map: Record<ActorId, string>;
  status: Record<ActorId, SubmissionStatus>;
}

export type SubmissionStatus = "submitted" | "rejected" | "approved";

export class Program {
  public readonly registry: TypeRegistry;
  public readonly infoQuestSvc: InfoQuestSvc;

  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      UserInput: {"login_method":"String","deadline":"String","title":"String","description":"String","submission_requirements":"String","submission_type":"String","reward_amount":"String"},
      InformationQuest: {"login_method":"String","deadline":"String","title":"String","description":"String","submission_requirements":"String","submission_type":"String","reward_amount":"String","submissions":"Submissions"},
      Submissions: {"map":"BTreeMap<[u8;32], String>","status":"BTreeMap<[u8;32], SubmissionStatus>"},
      SubmissionStatus: {"_enum":["Submitted","Rejected","Approved"]},
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

  public async getState(user: ActorId, originAddress?: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<InformationQuest | null> {
    const payload = this._program.registry.createType('(String, String, [u8;32])', ['InfoQuestSvc', 'GetState', user]).toHex();
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

  public subscribeToPublishedEvent(callback: (data: [ActorId, Record<ActorId, InformationQuest>]) => void | Promise<void>): Promise<() => void> {
    return this._program.api.gearEvents.subscribeToGearEvent('UserMessageSent', ({ data: { message } }) => {;
      if (!message.source.eq(this._program.programId) || !message.destination.eq(ZERO_ADDRESS)) {
        return;
      }

      const payload = message.payload.toHex();
      if (getServiceNamePrefix(payload) === 'InfoQuestSvc' && getFnNamePrefix(payload) === 'Published') {
        callback(this._program.registry.createType('(String, String, ([u8;32], BTreeMap<[u8;32], InformationQuest>))', message.payload)[2].toJSON() as unknown as [ActorId, Record<ActorId, InformationQuest>]);
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
}