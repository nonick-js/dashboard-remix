import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import { type ActionFunctionArgs, type LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import type { MetaFunction } from '@remix-run/react';
import { Form as RemixForm, useActionData, useLoaderData, useParams } from '@remix-run/react';
import { ChannelType } from 'discord-api-types/v10';
import { useWatch } from 'react-hook-form';
import { RemixFormProvider, useRemixForm, useRemixFormContext } from 'remix-hook-form';
import type { z } from 'zod';
import { hasAccessPermission, updateConfig } from '~/.server/dashboard';
import { getChannels } from '~/.server/discord';
import { FormActionButtons, FormCard, FormSelectClassNames } from '~/components/form-utils';
import { Header, HeaderDescription, HeaderTitle } from '~/components/header';
import { ChannelSelect } from '~/components/selects/channel-select';
import { RoleSelect } from '~/components/selects/role-select';
import { FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { useFormReset } from '~/hooks/form-revalidate';
import { useFormToast } from '~/hooks/form-toast';
import * as model from '~/libs/database/models';
import * as schema from '~/libs/database/zod';

// #region Page
export const meta: MetaFunction = () => {
  return [{ title: 'サーバー内通報 - NoNICK.js' }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(args);
  if (!ok) return redirect('/');

  const [channels, config] = await Promise.all([
    getChannels(data.guild.id),
    model.ReportConfig.findOne({ guildId: data.guild.id }),
  ]);
  const roles = data.roles;
  const parsedConfig = config ? schema.ReportConfig.parse(config.toJSON()) : null;

  return json(
    { channels, roles, config: parsedConfig },
    { headers: { 'Cache-Control': 'no-store' } },
  );
};

export const action = async (args: ActionFunctionArgs) => {
  const res = await updateConfig(args, model.ReportConfig, schema.ReportConfig);
  return json(res);
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>サーバー内通報</HeaderTitle>
        <HeaderDescription>
          不適切なメッセージやユーザーをメンバーが通報できるようにします。
        </HeaderDescription>
      </Header>
      <Form />
    </>
  );
}
// #endregion

// #region Form
type Config = z.infer<typeof schema.ReportConfig>;

export function Form() {
  const actionResult = useActionData<typeof action>();
  const { config } = useLoaderData<typeof loader>();

  const form = useRemixForm<Config>({
    resolver: zodResolver(schema.ReportConfig),
    defaultValues: config ?? {
      channel: '',
      includeModerator: false,
      progressButton: true,
      mention: {
        enabled: false,
        roles: [],
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
        <NotificationConfigForm />
        <FormActionButtons />
      </RemixForm>
    </RemixFormProvider>
  );
}

function EnableConfigForm() {
  const { channels } = useLoaderData<typeof loader>();
  const form = useRemixFormContext<Config>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='channel'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='通報を受け取るチャンネル' isRequired />
            <FormControl ref={ref}>
              <ChannelSelect
                classNames={FormSelectClassNames.single}
                onChange={onChange}
                onBlur={onBlur}
                selectedKeys={value ? [value] : []}
                channels={channels}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isRequired
                disallowEmptySelection
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfigForm() {
  const form = useRemixFormContext<Config>();

  return (
    <FormCard title='基本設定'>
      <FormField
        control={form.control}
        name='includeModerator'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='モデレーターも通報の対象にする'
              description='有効にすると、「メンバー管理」権限を持つユーザーをメンバーが通報できるようになります。'
            />
            <FormControl ref={ref}>
              <Switch onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='progressButton'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='進捗ボタンを表示する'
              description='送られた通報に「対処済み」「無視」などの、通報のステータスを管理できるボタンを表示します。'
            />
            <FormControl ref={ref}>
              <Switch onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function NotificationConfigForm() {
  const { roles } = useLoaderData<typeof loader>();
  const form = useRemixFormContext<Config>();
  const { mention } = useWatch<Config>();
  const { guildId } = useParams();

  return (
    <FormCard title='通知設定'>
      <FormField
        control={form.control}
        name='mention.enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='メンション通知を有効にする'
              description='通報が送られた際に特定のロールをメンションします。'
            />
            <FormControl ref={ref}>
              <Switch onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='mention.roles'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='メンションするロール （複数選択可）'
              isRequired
              isDisabled={!mention?.enabled}
            />
            <FormControl ref={ref}>
              <RoleSelect
                classNames={FormSelectClassNames.multiple}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                selectedKeys={value.filter((id) => roles.some((role) => role.id === id))}
                selectionMode='multiple'
                roles={roles}
                disabledKeyFilter={(role) => role.managed || role.id === guildId}
                isInvalid={invalid}
                isDisabled={!mention?.enabled}
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
