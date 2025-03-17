import IMask from 'imask'
void (function () {
    const telInput = document.querySelector<HTMLInputElement>('.kviz__form-input input[type="tel"]')
    if (telInput) {
        IMask(telInput, {
            mask: '+{7}(000)000-00-00',
            lazy: false,
        })
    }

    function validateTelInput(input: HTMLInputElement) {
        let valid = true
        if (input.type !== 'tel') return valid

        const tel = input.value.replaceAll(/\D/g, '')
        valid = /7\d{10}/.test(tel)
        return valid
    }

    const slideNumber = document?.querySelector('.kviz__next span')

    const nextButton = document.querySelector('.kviz__next')
    nextButton?.addEventListener('click', () => {
        const currentSlide = document.querySelector<HTMLElement>('.kviz__content._active')
        const hasCheckedInput = !!currentSlide?.querySelector('input:checked')

        if (!hasCheckedInput) return

        currentSlide?.classList.remove('_active')
        const nextSlide = currentSlide?.nextElementSibling as HTMLElement
        nextSlide.classList.add('_active')

        if (!slideNumber) return
        slideNumber.textContent = `${nextSlide.dataset.slideId}/6`
    })

    const prevButton = document.querySelector('.kviz__prev')
    prevButton?.addEventListener('click', () => {
        const currentSlide = document.querySelector<HTMLElement>('.kviz__content._active')
        const prevSlide = currentSlide?.previousElementSibling as HTMLElement

        currentSlide?.classList.remove('_active')
        prevSlide?.classList.add('_active')

        if (!slideNumber) return

        slideNumber.textContent = `${prevSlide.dataset.slideId}/6`
    })

    const dataImageItem = document.querySelectorAll<HTMLElement>('.kviz__variants-item[data-image]')
    dataImageItem.forEach((item, index) => {
        const input = item.querySelector('input')
        if (!input) return
        if (index === 0) {
            input.checked = true
            const activeImageData = item.dataset.image
            const activeImage = item
                .closest('.kviz__content')
                ?.querySelector(`.kviz__image[data-image-id='${activeImageData}']`)
            activeImage?.classList.add('_active')
        }

        input?.addEventListener('change', () => {
            const currentActiveImage = item.closest('.kviz__content')?.querySelector('.kviz__image._active')
            currentActiveImage?.classList.remove('_active')

            const activeImageData = item.dataset.image
            const activeImage = item
                .closest('.kviz__content')
                ?.querySelector(`.kviz__image[data-image-id='${activeImageData}']`)
            activeImage?.classList.add('_active')
        })
    })

    const form = document.querySelector<HTMLFormElement>('form.kviz__container')
    form?.addEventListener('submit', async (e) => {
        e.preventDefault()
        const telInput = form.querySelector<HTMLInputElement>('input[type="tel"]')
        if (telInput && !validateTelInput(telInput)) {
            telInput.classList.add('_invalid')
            return
        }
        const formData = new FormData(form)

        const handlerPath = form.dataset.handler
        if (!handlerPath) return console.error('data-handler should be not empty. Form element:\n', form)
        const res = await fetch(handlerPath, {
            method: 'POST',
            body: formData,
        })

        if (!res.ok) {
            return console.error(
                'Error while submitting form\n',
                form,
                '\n',
                'FormData:\n',
                formData,
                '\n',
                'Response:\n',
                res,
            )
        }

        const thanks = document.querySelector('.kviz-thanks')
        thanks?.classList.add('_active')
    })

    const firstSlide = document.querySelector('.kviz__content[data-slide-id="1"]')
    firstSlide?.classList.add('_active')
})()
