import { Button } from '@/common/components/_base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/common/components/_base/dialog'
import { InputField } from '@/common/components/_base/input-field'
import { SelectField } from '@/common/components/_base/select-field'
import { cars } from '@/common/mocks/cars'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { GripVertical, MapPin, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const stopSchema = z.object({
  order: z.number().int().min(1),
  name: z.string().min(1, 'Stop name is required'),
})

const routeSchema = z.object({
  startKm: z.number().min(1, 'Start KM is required'),
  date: z.string().min(1, 'Date is required'),
  carId: z.string().min(1, 'Car is required'),
  stops: z
    .array(stopSchema)
    .min(1, 'At least one stop is required')
    .refine((stops) => new Set(stops.map((s) => s.order)).size === stops.length, {
      message: 'Stop order must be unique',
      path: ['stops'],
    }),
})

type RouteFormValues = z.infer<typeof routeSchema>

type AddRouteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues: RouteFormValues = {
  startKm: 0,
  date: dayjs().format('YYYY-MM-DD'),
  carId: '',
  stops: [{ order: 1, name: '' }],
}

function formatKmWithSpaces(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function AddRouteModal({ open, onOpenChange }: AddRouteModalProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues,
  })

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'stops',
  })

  const syncOrders = useCallback(() => {
    const currentStops = getValues('stops')
    const orderedStops = currentStops.map((stop, index) => ({
      ...stop,
      order: index + 1,
    }))
    setValue('stops', orderedStops, { shouldValidate: true, shouldDirty: true })
  }, [getValues, setValue])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaultValues)
      setDragIndex(null)
    }
    onOpenChange(nextOpen)
  }

  function handleClose() {
    handleOpenChange(false)
  }

  function onSubmit(data: RouteFormValues) {
    console.log('Route submitted:', data)
    handleClose()
  }

  function handleAddStop() {
    append({ order: fields.length + 1, name: '' })
  }

  function handleRemoveStop(index: number) {
    remove(index)
    requestAnimationFrame(syncOrders)
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null)
      return
    }

    move(dragIndex, targetIndex)
    setDragIndex(null)
    requestAnimationFrame(syncOrders)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader className="rounded-t-2xl bg-gradient-to-r from-primary to-primary-2 p-4 pb-3">
          <DialogTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5" />
            Add Route
          </DialogTitle>
          <DialogDescription className="text-white/75">
            Set route details and order the stops by dragging.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-2 overflow-y-auto px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="startKm"
            control={control}
            render={({ field: { value, onChange, onBlur, name, ref } }) => (
              <InputField
                id="startKm"
                name={name}
                ref={ref}
                label="Start KM"
                type="text"
                inputMode="numeric"
                value={formatKmWithSpaces(value?.toString() ?? '')}
                onBlur={onBlur}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/\D/g, '')
                  onChange(digitsOnly)
                }}
                error={errors.startKm?.message}
              />
            )}
          />

          <InputField
            id="routeDate"
            type="date"
            label="Date"
            error={errors.date?.message}
            {...register('date')}
          />

          <Controller
            name="carId"
            control={control}
            render={({ field: { value, onChange } }) => (
              <SelectField
                id="carId"
                label="Car"
                error={errors.carId?.message}
                options={cars.map((car) => ({ value: car.id, label: car.label }))}
                value={value}
                onValueChange={onChange}
              />
            )}
          />

          <div className="mt-1">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">Stops</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-accent bg-accent text-accent-foreground hover:bg-accent-2"
                onClick={handleAddStop}
              >
                <Plus className="h-4 w-4" />
                Add Stop
              </Button>
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={() => setDragIndex(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="rounded-lg border-l-4 border-l-accent border border-border bg-white p-2"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 cursor-grab text-accent" />
                      <span className="text-xs font-semibold text-foreground">
                        Stop #{index + 1}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-md text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => handleRemoveStop(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <input
                    type="hidden"
                    value={index + 1}
                    {...register(`stops.${index}.order`, { valueAsNumber: true })}
                  />

                  <InputField
                    id={`stop-name-${field.id}`}
                    label="Stop Name"
                    error={errors.stops?.[index]?.name?.message}
                    {...register(`stops.${index}.name`)}
                  />
                </div>
              ))}
            </div>

            <div className="h-4">
              {errors.stops?.message && (
                <p className="text-xs text-destructive">{errors.stops.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border/50 px-0">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border text-muted-foreground hover:bg-secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1 bg-accent text-accent-foreground shadow-cta hover:bg-accent-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Route'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
