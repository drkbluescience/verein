declare module 'mammoth' {
  export interface MammothMessage {
    type: string;
    message: string;
  }

  export interface MammothResult {
    value: string;
    messages: MammothMessage[];
  }

  export interface ConvertToHtmlOptions {
    styleMap?: string[];
  }

  export interface ArrayBufferInput {
    arrayBuffer: ArrayBuffer | Uint8Array;
  }

  const mammoth: {
    convertToHtml: (
      input: ArrayBufferInput,
      options?: ConvertToHtmlOptions
    ) => Promise<MammothResult>;
  };

  export default mammoth;
}
