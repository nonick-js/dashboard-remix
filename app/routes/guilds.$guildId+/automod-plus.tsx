import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { Accordion, AccordionItem, Switch, Textarea, cn } from '@nextui-org/react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  type MetaFunction,
  Form as RemixForm,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from '@remix-run/react';
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
import { Alert, AlertTitle } from '~/components/ui/alert';
import { FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form';
import { useFormReset } from '~/hooks/form-revalidate';
import { useFormToast } from '~/hooks/form-toast';
import { AutoModConfig as model } from '~/libs/database/models';
import { AutoModConfig as schema } from '~/libs/database/zod';

//#region Page
export const meta: MetaFunction = () => {
  return [{ title: 'AutoMod Plus - NoNICK.js' }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(args);
  if (!ok) return redirect('/');

  const roles = data.roles;
  const [channels, config] = await Promise.all([
    getChannels(data.guild.id),
    model.findOne({ guildId: data.guild.id }),
  ]);

  return json(
    { roles, channels, config: schema.safeParse(config).data },
    { headers: { 'Cache-Control': 'no-store' } },
  );
};

export const action = async (args: ActionFunctionArgs) => {
  const res = await updateConfig(args, model, schema);
  return json(res);
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>AutoMod Plus</HeaderTitle>
        <HeaderDescription>特定の条件を満たすメッセージを自動で削除します。</HeaderDescription>
      </Header>
      <Form />
    </>
  );
}
// #endregion

// #region Form
type Config = z.input<typeof schema>;

export function Form() {
  const actionResult = useActionData<typeof action>();
  const { config } = useLoaderData<typeof loader>();

  const form = useRemixForm<Config>({
    resolver: zodResolver(schema),
    defaultValues: config ?? {
      enabled: false,
      filter: {
        domain: { enabled: false, list: [] },
        token: false,
        inviteUrl: false,
      },
      ignore: { channels: [], roles: [] },
      log: { enabled: false, channel: null },
    },
  });

  useFormReset(form.reset, config, actionResult);
  useFormToast(actionResult);

  return (
    <RemixFormProvider {...form}>
      <RemixForm method='post' className='flex flex-col gap-6'>
        <EnableConfigForm />
        <FilterConfigForm />
        <IgnoreConfigForm />
        <LogConfigForm />
        <FormActionButtons />
      </RemixForm>
    </RemixFormProvider>
  );
}

function EnableConfigForm() {
  const form = useRemixFormContext<Config>();

  return (
    <FormCard>
      <FormField
        control={form.control}
        name='enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel title='AutoMod Plusを有効にする' />
            <FormControl>
              <Switch ref={ref} onChange={onChange} onBlur={onBlur} isSelected={value} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormCard>
  );
}

function FilterConfigForm() {
  const form = useRemixFormContext<Config>();
  const enabled = useWatch<Config>({ name: 'enabled' });
  const domainFilterEnabled = useWatch<Config>({ name: 'filter.domain.enabled' });

  return (
    <FormCard title='フィルター設定' className='gap-6'>
      <Accordion
        variant='splitted'
        selectionMode='multiple'
        className='px-0'
        itemClasses={{
          base: 'px-4 bg-default-100 shadow-none border-none',
          startContent: 'h-[20px] text-default-500',
          title: 'text-sm',
          content: 'pt-0 pb-4 flex flex-col gap-6',
        }}
        isDisabled={!enabled}
      >
        <AccordionItem
          title='Discordサーバーの招待リンク'
          startContent={<Icon icon='solar:link-round-bold' className='text-[20px]' />}
        >
          <FormField
            control={form.control}
            name='filter.inviteUrl'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormItem dir='row'>
                <FormLabel
                  title='招待リンクをブロックする'
                  description='このDiscordサーバー以外の招待リンクを含むメッセージを自動で削除します。'
                  isDisabled={!enabled}
                />
                <FormControl>
                  <Switch
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    isSelected={value}
                    isDisabled={!enabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </AccordionItem>
        <AccordionItem
          title='Discordトークン'
          startContent={<Icon icon='solar:shield-keyhole-bold' className='text-[20px]' />}
        >
          <FormField
            control={form.control}
            name='filter.token'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormItem dir='row'>
                <FormLabel
                  title='Discordトークンをブロックする'
                  description='Discordアカウントのトークンを含むメッセージを自動で削除します。'
                  isDisabled={!enabled}
                />
                <FormControl>
                  <Switch
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    isSelected={value}
                    isDisabled={!enabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </AccordionItem>
        <AccordionItem
          title='ドメイン'
          startContent={<Icon icon='solar:global-bold' className='text-[20px]' />}
        >
          <FormField
            control={form.control}
            name='filter.domain.enabled'
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <FormItem dir='row'>
                <FormLabel
                  title='特定のドメインをブロックする'
                  description='特定のドメインのURLを含むメッセージを自動で削除します。'
                  isDisabled={!enabled}
                />
                <FormControl>
                  <Switch
                    ref={ref}
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
            name='filter.domain.list'
            render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
              <FormItem dir='col'>
                <FormLabel
                  title='ブロックするドメイン'
                  description='ドメインはカンマ（例: nonick-js.com, discord.com）または改行で区分してください。'
                  isDisabled={!enabled || !domainFilterEnabled}
                />
                <FormControl>
                  <Textarea
                    ref={ref}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={Array.isArray(value) ? value.join(', ') : String(value)}
                    classNames={{
                      innerWrapper: 'flex-col items-end',
                    }}
                    variant='bordered'
                    endContent={
                      <span className={cn('text-default-500 text-sm', { 'text-danger': invalid })}>
                        {
                          String(value)
                            .split(/,|\n/)
                            .map((v) => v.trim())
                            .filter((v) => !!v).length
                        }
                        /20
                      </span>
                    }
                    isInvalid={invalid}
                    isDisabled={!enabled || !domainFilterEnabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </AccordionItem>
      </Accordion>
    </FormCard>
  );
}

function IgnoreConfigForm() {
  const form = useRemixFormContext<Config>();
  const disabled = !useWatch<Config>({ name: 'enabled' });
  const { channels } = useLoaderData<typeof loader>();
  const { roles } = useLoaderData<typeof loader>();
  const { guildId } = useParams();

  return (
    <FormCard title='例外設定'>
      <Alert variant='info' className={cn({ 'opacity-disabled': disabled })}>
        <AlertTitle>
          Botや「サーバー管理」権限を持っているユーザーは、この設定に関わらずフィルターが適用されません。
        </AlertTitle>
      </Alert>
      <FormField
        control={form.control}
        name='ignore.channels'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel
              title='フィルターを適用しないチャンネル'
              description='選択したチャンネルのスレッドもフィルターが適用されなくなります。'
              isDisabled={disabled}
            />
            <FormControl>
              <ChannelSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                selectedKeys={value.filter((id) => channels.some((channel) => channel.id === id))}
                selectionMode='multiple'
                classNames={FormSelectClassNames.multiple}
                channels={channels}
                types={{ exclude: [ChannelType.GuildCategory] }}
                isInvalid={invalid}
                isDisabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ignore.roles'
        render={({ field: { ref, onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormItem dir='row' mobileDir='col'>
            <FormLabel title='フィルターを適用しないロール' isDisabled={disabled} />
            <FormControl>
              <RoleSelect
                ref={ref}
                onSelectionChange={(keys) => onChange(Array.from(keys))}
                onBlur={onBlur}
                classNames={FormSelectClassNames.multiple}
                selectedKeys={value.filter((id) => roles.some((role) => role.id === id))}
                selectionMode='multiple'
                roles={roles}
                disabledKeyFilter={(role) => role.id === guildId}
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

function LogConfigForm() {
  const form = useRemixFormContext<Config>();
  const { channels } = useLoaderData<typeof loader>();
  const enabled = useWatch<Config>({ name: 'enabled' });
  const logEnabled = useWatch<Config>({ name: 'log.enabled' });

  return (
    <FormCard title='ログ設定'>
      <FormField
        control={form.control}
        name='log.enabled'
        render={({ field: { ref, onChange, onBlur, value } }) => (
          <FormItem dir='row'>
            <FormLabel
              title='ログを有効にする'
              description='フィルターによってメッセージが削除された際にログを送信します。'
              isDisabled={!enabled}
            />
            <FormControl>
              <Switch
                ref={ref}
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
              isDisabled={!enabled || !logEnabled}
              isRequired
            />
            <FormControl>
              <ChannelSelect
                ref={ref}
                classNames={FormSelectClassNames.single}
                onChange={onChange}
                onBlur={onBlur}
                selectedKeys={value ? [value] : []}
                channels={channels}
                types={{ include: [ChannelType.GuildText] }}
                isInvalid={invalid}
                isDisabled={!enabled || !logEnabled}
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
