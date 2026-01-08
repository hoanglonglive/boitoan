import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { ResultDrawer } from '@/components/ResultDrawer'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Eye, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CONFIG = getDivinationOption('tarot')!

export default function TarotPage() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useLocalStorage('prompt', '')
  const { result, loading, resultLoading, streaming, showDrawer, setShowDrawer, onSubmit } =
    useDivination('tarot')

  const handleSubmit = () => {
    onSubmit({
      prompt: prompt || t('divination.tarot.inputPlaceholder'),
    })
  }

  return (
    <DivinationCardHeader
      title={t('divination.tarot.title')}
      description={t('divination.tarot.description')}
      icon={CONFIG.icon}
      divinationType="tarot"
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('divination.tarot.inputPlaceholder')}
              maxLength={40}
              rows={3}
              className="resize-none w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t('divination.tarot.inputHint')}
            </p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 justify-center pt-4 md:pt-6">
          <Button
            onClick={() => setShowDrawer(!showDrawer)}
            variant="outline"
            className="gap-2 flex-1 md:flex-initial md:min-w-[140px]"
            disabled={!result}
          >
            <Eye className="h-4 w-4" />
            {t('divination.tarot.viewResult')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2 flex-1 md:flex-initial md:min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('divination.tarot.divining')}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t('divination.tarot.start')}
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
