import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { Input, type InputProps, Radio, RadioGroup, Switch, cn } from '@nextui-org/react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  type MetaFunction,
  Form as RemixForm,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from '@remix-run/react';
import { ChannelType, GuildVerificationLevel } from 'discord-api-types/v10';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import type * as z from 'zod';
import { hasAccessPermission, updateConfig } from '~/.server/dashboard';
import { getChannels } from '~/.server/discord';
import { FormActionButtons, FormCard, FormSelectClassNames } from '~/components/form-utils';
import { Header, HeaderDescription, HeaderTitle } from '~/components/header';
import { ChannelSelect } from '~/components/selects/channel-select';
import { FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { useFormReset } from '~/hooks/form-revalidate';
import { useFormToast } from '~/hooks/form-toast';
import * as model from '~/libs/database/models';
import * as schema from '~/libs/database/zod';

// #region Page
export const meta: MetaFunction = () => {
  return [{ title: '自動認証レベル変更 - NoNICK.js' }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(args);
  if (!ok) return redirect('/');

  const [channels, config] = await Promise.all([
    getChannels(data.guild.id),
    model.AutoChangeVerifyLevelConfig.findOne({ guildId: data.guild.id }),
  ]);
  const parsedConfig = config ? schema.AutoChangeVerifyLevelConfig.parse(config.toJSON()) : null;

  return json({ channels, config: parsedConfig }, { headers: { 'Cache-Control': 'no-store' } });
};

export const action = async (args: ActionFunctionArgs) => {
  const res = await updateConfig(
    args,
    model.AutoChangeVerifyLevelConfig,
    schema.AutoChangeVerifyLevelConfig,
  );
  return json(res);
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>自動認証レベル変更</HeaderTitle>
        <HeaderDescription>サーバーの認証レベルを特定の時間帯だけ変更します。</HeaderDescription>
      </Header>
      <Form />
    </>
  );
}
// #endregion

// #region Form
type Config = z.infer<typeof schema.AutoChangeVerifyLevelConfig>;

export function Form() {
  const actionResult = useActionData<typeof action>();
  const { config } = useLoaderData<typeof loader>();

  const form = useRemixForm<Config>({
    resolver: zodResolver(schema.AutoChangeVerifyLevelConfig),
    defaultValues: config ?? {
      enabled: false,
      level: GuildVerificationLevel.Low,
      startHour: 0,
      endHour: 6,
      log: {
        enabled: false,
        channel: null,
      },
    },
  });

  useFormReset(form.reset, config, actionResult);
  useFormToast(actionResult);

  return (
    <RemixFormProvider {...form}>
      <RemixForm onSubmit={form.handleSubmit} method='post' className='flex flex-col gap-6'>
        <EnableConfigForm />
        <GeneralConfigForm />
        <LogConfigForm />
        <FormActionButtons />
      </RemixForm>
    </RemixFormProvider>
  );
}

function EnableConfigForm() {
  const form = useFormContext<Config>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel title='自動認証レベル変更を有効にする' />
            <FormControl ref={ref}>
              <Switch onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

const HourInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      classNames={{
        base: 'max-sm:w-[120px] w-[150px]',
        mainWrapper: 'data-[invalid=true]:text-danger',
      }}
      variant='bordered'
      type='number'
      startContent={
        <Icon className='text-[20px] text-foreground-400' icon='solar:clock-circle-bold' />
      }
      endContent={<span className='text-small text-foreground-400'>:00</span>}
      {...props}
    />
  );
});

function CustomRadioClassName(color: Omit<GuildVerificationLevel, 'None'>) {
  return {
    base: cn(
      'inline-flex m-0 bg-content2 items-center justify-between w-full max-w-none',
      ' w-full cursor-pointer rounded-lg gap-2 px-4 py-3',
    ),
    label: cn(
      { 'text-green-500': color === GuildVerificationLevel.Low },
      { 'text-yellow-500': color === GuildVerificationLevel.Medium },
      { 'text-orange-500': color === GuildVerificationLevel.High },
      { 'text-red-500': color === GuildVerificationLevel.VeryHigh },
    ),
    description: 'text-default-500',
    labelWrapper: 'flex-1',
  };
}

function GeneralConfigForm() {
  const form = useFormContext<Config>();
  const { enabled } = useWatch<Config>();

  return (
    <FormCard title='全般設定'>
      <div className='flex flex-col gap-3'>
        <FormField
          control={form.control}
          name='startHour'
          render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
            <FormItem dir='row'>
              <FormLabel title='開始時間（0:00～23:00）' isRequired isDisabled={!enabled} />
              <FormControl ref={ref}>
                <HourInput
                  onChange={(e) => onChange(Number(e.target.value))}
                  value={String(value)}
                  isInvalid={invalid}
                  isDisabled={!enabled}
                  isRequired
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endHour'
          render={({ field: { ref, onChange, value }, fieldState: { invalid } }) => (
            <FormItem dir='row'>
              <FormLabel title='終了時間（0:00～23:00）' isRequired isDisabled={!enabled} />
              <FormControl ref={ref}>
                <HourInput
                  onChange={(e) => onChange(Number(e.target.value))}
                  value={String(value)}
                  isInvalid={invalid}
                  isDisabled={!enabled}
                  isRequired
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name='level'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem className='gap-4' dir='col'>
            <FormLabel title='期間内に設定する認証レベル' isRequired isDisabled={!enabled} />
            <FormControl ref={ref}>
              <RadioGroup
                onChange={(e) => onChange(Number(e.target.value))}
                onBlur={onBlur}
                value={String(value)}
                isDisabled={!enabled}
                isInvalid={invalid}
              >
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.Low)}
                  value={String(GuildVerificationLevel.Low)}
                  description='メール認証がされているアカウントのみ'
                >
                  低
                </Radio>
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.Medium)}
                  value={String(GuildVerificationLevel.Medium)}
                  description='Discordに登録してから5分以上経過したアカウントのみ'
                >
                  中
                </Radio>
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.High)}
                  value={String(GuildVerificationLevel.High)}
                  description='このサーバーのメンバーとなってから10分以上経過したアカウントのみ'
                >
                  高
                </Radio>
                <Radio
                  classNames={CustomRadioClassName(GuildVerificationLevel.VeryHigh)}
                  value={String(GuildVerificationLevel.VeryHigh)}
                  description='電話認証がされているアカウントのみ'
                >
                  最高
                </Radio>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function LogConfigForm() {
  const form = useFormContext<Config>();
  const { channels } = useLoaderData<typeof loader>();
  const { enabled, log } = useWatch<Config>();

  return (
    <FormCard title='ログ設定'>
      <FormField
        control={form.control}
        name='log.enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='ログを有効にする'
              description='自動変更の開始・終了時にログを送信します。'
              isDisabled={!enabled}
            />
            <FormControl ref={ref}>
              <Switch
                onChange={onChange}
                onBlur={onBlur}
                isSelected={value}
                isDisabled={!enabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='log.channel'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='ログを送信するチャンネル'
              isDisabled={!enabled || !log?.enabled}
              isRequired
            />
            <FormControl ref={ref}>
              <ChannelSelect
                classNames={FormSelectClassNames.single}
                onChange={onChange}
                onBlur={onBlur}
                selectedKeys={value ? [value] : []}
                channels={channels}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isDisabled={!enabled || !log?.enabled}
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
// #endregion
