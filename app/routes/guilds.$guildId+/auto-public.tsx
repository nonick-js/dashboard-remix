import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@nextui-org/react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  type MetaFunction,
  Form as RemixForm,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from '@remix-run/react';
import { ChannelType } from 'discord-api-types/v10';
import { useFormContext, useWatch } from 'react-hook-form';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import type { z } from 'zod';
import { hasAccessPermission, updateConfig } from '~/.server/dashboard';
import { getChannels } from '~/.server/discord';
import { FormActionButtons, FormCard } from '~/components/form-utils';
import { Header, HeaderDescription, HeaderTitle } from '~/components/header';
import { ChannelSelect } from '~/components/selects/channel-select';
import { FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { useFormReset } from '~/hooks/form-revalidate';
import { useFormToast } from '~/hooks/form-toast';
import * as model from '~/libs/database/models';
import * as schema from '~/libs/database/zod';

// #region Page
export const meta: MetaFunction = () => {
  return [{ title: '自動アナウンス公開 - NoNICK.js' }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(args);
  if (!ok) return redirect('/');

  const [channels, config] = await Promise.all([
    getChannels(data.guild.id),
    model.AutoPublicConfig.findOne({ guildId: data.guild.id }),
  ]);

  return json(
    { channels, config: schema.AutoPublicConfig.safeParse(config).data },
    { headers: { 'Cache-Control': 'no-store' } },
  );
};

export const action = async (args: ActionFunctionArgs) => {
  const res = await updateConfig(args, model.AutoPublicConfig, schema.AutoPublicConfig);
  return json(res);
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>自動アナウンス公開</HeaderTitle>
        <HeaderDescription>
          アナウンスチャンネルに投稿されたメッセージを自動で公開します。
        </HeaderDescription>
      </Header>
      <Form />
    </>
  );
}
// #endregion

// #region Form
type Config = z.input<typeof schema.AutoPublicConfig>;

export function Form() {
  const actionResult = useActionData<typeof action>();
  const { config } = useLoaderData<typeof loader>();

  const form = useRemixForm<Config>({
    resolver: zodResolver(schema.AutoPublicConfig),
    defaultValues: config ?? {
      enabled: false,
      channels: [],
    },
  });

  useFormReset(form.reset, config, actionResult);
  useFormToast(actionResult);

  return (
    <RemixFormProvider {...form}>
      <RemixForm method='post' className='flex flex-col gap-6'>
        <EnableConfigForm />
        <GeneralConfigForm />
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
            <FormLabel title='自動アナウンス公開を有効にする' />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function GeneralConfigForm() {
  const form = useFormContext<Config>();
  const { channels } = useLoaderData<typeof loader>();
  const disabled = !useWatch<Config>({ name: 'enabled' });

  return (
    <FormCard title='全般設定'>
      <FormField
        control={form.control}
        name='channels'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='自動公開するチャンネル' isDisabled={disabled} />
            <FormControl>
              <ChannelSelect
                ref={ref}
                classNames={{
                  trigger: 'py-2',
                  base: 'md:max-w-sm',
                }}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                selectedKeys={value.filter((key) => channels.some((c) => c.id === key))}
                selectionMode='multiple'
                channels={channels}
                types={{ include: [ChannelType.GuildAnnouncement] }}
                isInvalid={invalid}
                isDisabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}
// #endregion
