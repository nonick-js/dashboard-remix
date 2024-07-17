import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/react';
import { Form as RemixForm, json, redirect, useActionData, useLoaderData } from '@remix-run/react';
import { ChannelType } from 'discord-api-types/v10';
import { useFormContext, useWatch } from 'react-hook-form';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import type { z } from 'zod';
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
  return [{ title: 'イベントログ - NoNICK.js' }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(args);
  if (!ok) return redirect('/');

  const [channels, config] = await Promise.all([
    getChannels(data.guild.id),
    model.EventLogConfig.findOne({ guildId: data.guild.id }),
  ]);

  return json({ channels, config: config?.toJSON() }, { headers: { 'Cache-Control': 'no-store' } });
};

export const action = async (args: ActionFunctionArgs) => {
  const res = await updateConfig(args, model.EventLogConfig, schema.EventLogConfig);
  return json(res);
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>イベントログ</HeaderTitle>
        <HeaderDescription>サーバー内で起こった特定イベントのログを送信します。</HeaderDescription>
      </Header>
      <Form />
    </>
  );
}
// #endregion

// #region Form
type Config = z.infer<typeof schema.EventLogConfig>;

export function Form() {
  const actionResult = useActionData<typeof action>();
  const { config } = useLoaderData<typeof loader>();

  const form = useRemixForm<Config>({
    resolver: zodResolver(schema.EventLogConfig),
    defaultValues: config ?? {
      timeout: { enabled: false, channel: null },
      kick: { enabled: false, channel: null },
      ban: { enabled: false, channel: null },
      voice: { enabled: false, channel: null },
      messageDelete: { enabled: false, channel: null },
      messageEdit: { enabled: false, channel: null },
    },
  });

  useFormReset(form.reset, config, actionResult);
  useFormToast(actionResult);

  return (
    <RemixFormProvider {...form}>
      <RemixForm onSubmit={form.handleSubmit} method='post' className='flex flex-col gap-6'>
        <LogConfigForm
          name='timeout'
          cardTitle='タイムアウト'
          labelTitle='タイムアウトログを有効にする'
          labelDescription='メンバーをタイムアウトしたり、タイムアウトを手動で解除したりした際にログを送信します。'
        />
        <LogConfigForm
          name='kick'
          cardTitle='キック'
          labelTitle='キックログを有効にする'
          labelDescription='メンバーをキックした際にログを送信します。'
        />
        <LogConfigForm
          name='ban'
          cardTitle='BAN'
          labelTitle='BANログを有効にする'
          labelDescription='メンバーをBANしたり、BANを解除した際にログを送信します。'
        />
        <LogConfigForm
          name='voice'
          cardTitle='ボイスチャット'
          labelTitle='VCログを有効にする'
          labelDescription='ボイスチャットの入室や退室、移動があった際にログを送信します。'
        />
        <LogConfigForm
          name='messageEdit'
          cardTitle='メッセージ編集'
          labelTitle='編集ログを有効にする'
          labelDescription='メッセージが編集された際にログを送信します。'
        />
        <LogConfigForm
          name='messageDelete'
          cardTitle='メッセージ削除'
          labelTitle='削除ログを有効にする'
          labelDescription='メッセージが削除された際にログを送信します。'
        />
        <FormActionButtons />
      </RemixForm>
    </RemixFormProvider>
  );
}

function LogConfigForm({
  name,
  cardTitle,
  labelTitle,
  labelDescription,
}: {
  name: keyof Omit<Config, 'guildId'>;
  cardTitle: string;
  labelTitle: string;
  labelDescription: string;
}) {
  const { channels } = useLoaderData<typeof loader>();
  const watch = useWatch<Config>();
  const form = useFormContext<Config>();

  return (
    <FormCard title={cardTitle}>
      <FormField
        control={form.control}
        name={`${name}.enabled`}
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel title={labelTitle} description={labelDescription} />
            <FormControl ref={ref}>
              <Switch onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${name}.channel`}
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='ログを送信するチャンネル'
              isDisabled={!watch?.[name]?.enabled}
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
                isDisabled={!watch?.[name]?.enabled}
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
