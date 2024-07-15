import type { FieldValues } from 'react-hook-form';

export type ActionResult =
  | {
      ok: true;
      message: string;
      data: FieldValues;
    }
  | {
      ok: false;
      message: string;
    };
