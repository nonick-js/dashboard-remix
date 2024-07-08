import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import { Form as RemixForm, useActionData, useLoaderData, useParams } from '@remix-run/react';
import { ChannelType } from 'discord-api-types/v10';
import { useWatch } from 'react-hook-form';
import { RemixFormProvider, useRemixForm, useRemixFormContext } from 'remix-hook-form';
import type * as z from 'zod';
import { FormActionButtons, FormCard, FormSelectClassNames } from '~/components/form-utils';
import { ChannelSelect } from '~/components/selects/channel-select';
import { RoleSelect } from '~/components/selects/role-select';
import { FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { useFormGuard } from '~/hooks/form-guard';
import { useFormRevalidate } from '~/hooks/form-revalidate';
import { useFormToast } from '~/hooks/form-toast';
import * as schema from '~/libs/database/zod/config';
import type { action, loader } from './route';

type Config = z.infer<typeof schema.ReportConfig>;

export function Form() {
  const actionData = useActionData<typeof action>();
  const { config } = useLoaderData<typeof loader>();
  const { guildId } = useParams();

  const form = useRemixForm<Config>({
    resolver: zodResolver(schema.ReportConfig),
    defaultValues: config ?? {
      guildId,
      channel: '',
      includeModerator: false,
      progressButton: true,
      mention: {
        enabled: false,
        roles: [],
      },
    },
  });

  useFormRevalidate(form.reset, !!actionData?.ok, actionData?.data);
  useFormToast(actionData);
  useFormGuard(form.formState.isDirty);

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
  const { mention, guildId } = useWatch<Config>();

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
