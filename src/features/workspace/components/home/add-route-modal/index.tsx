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
import { SearchableSelectField } from '@/common/components/_base/searchable-select-field'
import { GripVertical, MapPin, Plus, Trash2 } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { useAddRouteModal } from './useAddRouteModal'

type AddRouteModalProps = {
  mobile?: boolean
}

function formatKmWithSpaces(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/** First route item is the starting point; further items are Stop 1, 2, … */
function getRoutePointLabel(index: number) {
  if (index === 0) return 'Starting point'
  return `Stop ${index}`
}

export function AddRouteModal({ mobile = false }: AddRouteModalProps) {
  const {
    open,
    setOpen,
    setDragIndex,
    categorySearchValue,
    setCategorySearchValue,
    carSearchValue,
    setCarSearchValue,
    carOptions,
    workspaceId,
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    filteredCategoryOptions,
    fields,
    handleOpenChange,
    handleClose,
    onSubmit,
    handleAddStop,
    handleRemoveStop,
    handleDrop,
  } = useAddRouteModal()

  return (
    <>
      {mobile ? (
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-border text-foreground shadow-lg hover:bg-secondary"
          onClick={() => setOpen(true)}
          disabled={!workspaceId}
        >
          <MapPin className="h-5 w-5 text-primary" />
          Add Route
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-secondary"
          onClick={() => setOpen(true)}
          disabled={!workspaceId}
        >
          <MapPin className="h-4 w-4 text-primary" />
          Add Route
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader className="rounded-t-2xl bg-linear-to-r from-primary to-primary-2 p-4 pb-3">
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
                    onChange(digitsOnly === '' ? 0 : Number(digitsOnly))
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
              name="categoryId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SearchableSelectField
                  id="categoryId"
                  label="Category"
                  placeholder="Select a category"
                  searchPlaceholder="Search categories..."
                  noOptionsText="No categories found."
                  error={errors.categoryId?.message}
                  options={filteredCategoryOptions}
                  value={value}
                  onValueChange={onChange}
                  searchValue={categorySearchValue}
                  onSearchValueChange={setCategorySearchValue}
                />
              )}
            />

            <Controller
              name="carId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SearchableSelectField
                  id="carId"
                  label="Car"
                  placeholder="Select a car"
                  searchPlaceholder="Search by name or plate…"
                  noOptionsText="No cars found."
                  error={errors.carId?.message}
                  options={carOptions}
                  value={value}
                  onValueChange={onChange}
                  searchValue={carSearchValue}
                  onSearchValueChange={setCarSearchValue}
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
                          {getRoutePointLabel(index)}
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 rounded-md text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => handleRemoveStop(index)}
                        disabled={fields.length === 2}
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
                      label="Name"
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
    </>
  )
}
