
"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck } from "lucide-react"
import { Calendar24 } from "./date-picker"

interface InputProps {
  form: any
  nameFormField: string
  loading: boolean
  title: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const CalendarWithForm: React.FC<InputProps> = ({
  form,
  loading,
  nameFormField,
  title,
  icon: Icon = CalendarCheck,
}) => {

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={nameFormField}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Calendar24 value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
