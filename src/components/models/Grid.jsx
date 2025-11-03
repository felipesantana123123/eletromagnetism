export default function Grid({ size = 10, divisions = 10, axesSize = 5, ...props }) {
  return (
    <>
      <gridHelper args={[size, divisions]} {...props} />
      <axesHelper args={[axesSize]} />
    </>
  )
}