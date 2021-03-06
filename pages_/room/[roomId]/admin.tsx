import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Checkbox from '~/components/Checkbox'
import Container from '~/components/Container'
import Copy from '~/components/Copy'
import Heading from '~/components/Heading'
import InputText from '~/components/InputText'
import Layout from '~/components/Layout'
import Message, { MessageType } from '~/components/Message'
import Players from '~/components/Players'
import useRandomBoards from '~/hooks/useRandomBoards'
import useRoom from '~/hooks/useRoom'
import useRoomPlayers from '~/hooks/useRoomPlayers'
import Field from '~/interfaces/Field'
import db from '~/utils/firebase'
import scrollToTop from '~/utils/scrollToTop'

export default function Admin() {
  const { t, lang } = useTranslation()
  const [message, setMessage] = useState<{
    content: string
    type: MessageType
  }>({
    content: '',
    type: 'information',
  })
  const { players = [], setPlayers } = useRoomPlayers()
  const [room, setRoom] = useRoom()
  const randomBoards = useRandomBoards()

  useEffect(scrollToTop, [])

  const onFieldChange = (changes: { key: string; value: Field }[]) => {
    setRoom(...changes.map(({ key, value }) => ({ [key]: value })))
  }

  const removePlayer = (playerRef: firebase.firestore.DocumentReference) => {
    playerRef.delete()
  }

  const readyToPlay = async () => {
    setMessage({
      content: t('admin:success'),
      type: 'success',
    })

    const batch = db.batch()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref, ...roomValues } = room

    batch.update(room.ref, {
      ...roomValues,
      selectedNumbers: [],
      confettiType: '',
      readyToPlay: true,
    })

    players.map((player, index) => {
      const { name, ref: playerRef } = player
      batch.set(playerRef, {
        name,
        boards: randomBoards[index],
        selectedNumbers: [],
      })
    })

    await batch.commit()

    setTimeout(() => {
      Router.pushI18n('/room/[roomId]', `/room/${room.id}`)
    }, 1000)
  }

  return (
    <Layout>
      <Container>
        <Box>
          <Heading type="h2">{t('admin:title')}</Heading>
          {!room?.id && (
            <div className="mt-8">
              <Message type="information">{t('admin:loading')}</Message>
            </div>
          )}
          {room?.id && (
            <Fragment>
              <InputText
                id="room-name"
                label={t('admin:field-name')}
                value={room.name}
                readonly
                onFocus={event => event.target.select()}
              />
              <InputText
                hint={t('admin:field-link-hint')}
                id="url"
                label={t('admin:field-link')}
                value={`${window.location.host}/${lang}/room/${room.id}`}
                readonly
                onFocus={event => event.target.select()}
              />
              <Copy
                content={`${window.location.host}/${lang}/room/${room.id}`}
              />
              <InputText
                id="videoCall"
                label={t('admin:field-videocall')}
                onChange={value => onFieldChange([{ key: 'videoCall', value }])}
                value={room.videoCall || ''}
              />
              <Players
                players={players}
                setPlayers={setPlayers}
                adminId={room.adminId}
                onChange={onFieldChange}
                removePlayer={removePlayer}
                roomRef={room.ref}
              />
              <div className="mt-4">
                <Checkbox
                  hint={t('admin:field-bingo-spinner-hint')}
                  id="bingoSpinner"
                  label={t('admin:field-bingo-spinner')}
                  onChange={value =>
                    onFieldChange([{ key: 'bingoSpinner', value }])
                  }
                  value={room.bingoSpinner}
                />
              </div>
              <div className="mt-8">
                <Button
                  id="readyToPlay"
                  className="w-full"
                  disabled={!room.adminId}
                  onClick={readyToPlay}
                >
                  <FiSmile />
                  <span className="ml-4">{t('admin:field-submit')}</span>
                </Button>
              </div>
            </Fragment>
          )}
          {message.content && (
            <div className="mt-8">
              <Message type={message.type}>{message.content}</Message>
            </div>
          )}
        </Box>
      </Container>
    </Layout>
  )
}
