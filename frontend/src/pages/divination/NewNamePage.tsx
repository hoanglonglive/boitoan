import { useState, useEffect } from 'react'
import { Solar } from 'lunar-javascript'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { ResultDrawer } from '@/components/ResultDrawer'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const CONFIG = getDivinationOption('new_name')!

export default function NewNamePage() {
  const { t } = useTranslation()
  const [birthday, setBirthday] = useLocalStorage('birthday', '2000-08-17T00:00')
  const [sex, setSex] = useState('')
  const [surname, setSurname] = useState('')
  const [newNamePrompt, setNewNamePrompt] = useState('')
  const [lunarBirthday, setLunarBirthday] = useState('')
  const { result, loading, resultLoading, streaming, showDrawer, setShowDrawer, onSubmit } =
    useDivination('new_name')

  const computeLunarBirthday = (birthdayStr: string) => {
    try {
      const date = new Date(birthdayStr)
      const solar = Solar.fromYmdHms(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
      setLunarBirthday(solar.getLunar().toFullString())
    } catch (error) {
      console.error(error)
      setLunarBirthday(t('divination.new_name.lunarConvertFail'))
    }
  }

  useEffect(() => {
    computeLunarBirthday(birthday)
  }, [birthday])

  const handleSubmit = () => {
    // 验证必填字段
    if (!surname || !sex) {
      toast.error(t('divination.new_name.fillSurnameGender'))
      return
    }

    // 将日期格式从 ISO 格式转换为后端期望的格式
    const date = new Date(birthday)
    const formattedBirthday = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0') + ' ' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0') + ':' +
      String(date.getSeconds()).padStart(2, '0')

    onSubmit({
      prompt: `${surname} ${sex} ${formattedBirthday}`,
      birthday: formattedBirthday,  // 添加顶层 birthday 字段
      new_name: {
        surname,
        sex,
        birthday: formattedBirthday,
        new_name_prompt: newNamePrompt,
      },
    })
  }

  return (
    <DivinationCardHeader
      title={t('divination.new_name.title')}
      description={t('divination.new_name.description')}
      icon={CONFIG.icon}
      divinationType="new_name"
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <Label>{t('divination.new_name.surname')}</Label>
            <Input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder={t('divination.new_name.surnamePlaceholder')}
              maxLength={2}
              className="mt-2"
            />
          </div>
          <div>
            <Label>{t('divination.new_name.gender')}</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t('divination.new_name.genderPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="男">{t('divination.new_name.male')}</SelectItem>
                <SelectItem value="女">{t('divination.new_name.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block mb-2">{t('divination.new_name.birthdayLabel')}</Label>
            <Input
              type="datetime-local"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-auto inline-block"
            />
          </div>
          <div>
            <Label>{t('divination.new_name.extraRequirements')}</Label>
            <Input
              value={newNamePrompt}
              onChange={(e) => setNewNamePrompt(e.target.value)}
              maxLength={20}
              placeholder={t('divination.new_name.extraRequirementsPlaceholder')}
              className="mt-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">{t('divination.new_name.lunarPrefix')} {lunarBirthday}</p>
        </div>

        <div className="flex gap-2 md:gap-3 justify-center pt-4 md:pt-6">
          <Button
            onClick={() => setShowDrawer(!showDrawer)}
            variant="outline"
            className="gap-2 flex-1 md:flex-initial md:min-w-[140px]"
            disabled={!result}
          >
            <Eye className="h-4 w-4" />
            {t('divination.new_name.viewResult')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2 flex-1 md:flex-initial md:min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('divination.new_name.divining')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('divination.new_name.start')}
              </>
            )}
          </Button>
        </div>
      </div>

      <ResultDrawer
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        result={result}
        loading={resultLoading}
        streaming={streaming}
      />
    </DivinationCardHeader>
  )
}
