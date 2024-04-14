function Validator(formSelector,options={})
{  
    function getParent(element,selector)
    {
        while(element.parentElement)
        {
            if(element.parentElement.matches(selector))
            return element.parentElement
            element=element.parentElement
        }
    }
    var validatorRules=
    {
        required:function(value)
        {
            return value ? undefined :'Please fill this gap'
        },
        email:function(value)
        {
            var regx=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regx.test(value) ? undefined : 'this gap should be filled correct email'
        },
        min:function(min)
        {
            return function(value)
            {
                return value.length>=min ? undefined : `Please type at least ${min} characters`
            }
        },
        max:function(max)
        {
            return function(value)
            {
                return value.length<=max ? undefined : `Please type at least ${max} characters`
            }
        },
    }
    var formRules={}
    var formElement=document.querySelector(formSelector)
    if(formElement)
    {
        var inputs=formElement.querySelectorAll('[name][rules]')
        for(var input of inputs)
        {
            var rules=input.getAttribute('rules').split('|')
            for(var rule of rules)
            {
                var isRuleHasVal=rule.includes(':')
                var ruleInfo

                if(isRuleHasVal)
                {
                    ruleInfo=rule.split(':')
                    rule=ruleInfo[0]
                }

                var ruleFunc=validatorRules[rule]
                if(isRuleHasVal)
                ruleFunc=ruleFunc(ruleInfo[1])

                if(Array.isArray(formRules[input.name]))
                formRules[input.name].push(ruleFunc)
                else 
                formRules[input.name]=[ruleFunc]
            }
            input.onblur=handleValidate
            input.oninput=handleClearValidate
            formElement.onsubmit=handleSubmit
        }
    }

    function handleValidate(e)
    {
        var rulesFunc=formRules[e.target.name]
        var errorMes
        for(var ruleFunc of rulesFunc)
        {
            errorMes=ruleFunc(e.target.value)
            if(errorMes) break;
        }
        if(errorMes)
        {
            var formGroup=getParent(e.target,'.form-group');
            var formMes=formGroup.querySelector('.form-mes')
            if(formGroup)
                {
                    formGroup.classList.add('invalid')
                    formMes.innerText=errorMes
                }
        }
        return errorMes
    }
    function handleClearValidate(e)
    {
        var formGroup=getParent(e.target,'.form-group')
        if(formGroup.classList.contains('invalid'))
        {
            formGroup.classList.remove('invalid')
            var formMes=formGroup.querySelector('.form-mes')
            if(formMes)
            formMes.innerText=''
        }
    }
    function handleSubmit(e)
    {
        e.preventDefault()
        var inputs=formElement.querySelectorAll('[name][rules]')
        var isValid=true
        for(var input of inputs)
        {
            // auto create an event
            if(handleValidate({target:input}))
            isValid=false
        }
        if(isValid) 
        {
            if(typeof options.onSubmit==='function')
            {
                var formValues=Array.from(inputs).reduce((values,input)=>
            {
                values[input.name]=input.value
                return values;
            },{})
                options.onSubmit(formValues);
            }
            else
            formElement.submit();
        }
    }
}
Validator
    (
    
        '#register-form',
        {
            onSubmit: function (data)
            {
                console.log(data)
            }
        }
    );

